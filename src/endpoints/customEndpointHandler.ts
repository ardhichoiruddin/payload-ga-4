import type { Endpoint } from 'payload'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { JWT } from 'google-auth-library'
import type { GAPluginOptions } from '../types.js'
import { fillMissingDates } from '../utils/fillMissingDates.js'

let client: BetaAnalyticsDataClient | null = null

const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']

const getClient = (credentials: GAPluginOptions['credentials']) => {
  if (!client) {
    const authClient = new JWT({
      email: credentials.clientEmail,
      key: credentials.privateKey.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })
    client = new BetaAnalyticsDataClient({ authClient })
  }
  return client
}

const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size))
    return acc
  }, [])

export const createAnalyticsEndpoint = (
  credentials: GAPluginOptions['credentials'],
  propertyId: string,
  access?: GAPluginOptions['access'],
): Endpoint => ({
  path: '/ga-analytics/report',
  method: 'get',
  handler: async (req) => {
    const user = req.user

    if (!user) {
      return Response.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 })
    }

    const hasAccess = access ? await access(user) : true

    if (!hasAccess) {
      return Response.json(
        { error: 'Forbidden. You do not have access to analytics.' },
        { status: 403 },
      )
    }

    try {
      const url = new URL(req.url!, `http://${req.headers.get('host')}`)
      const timeframe = url.searchParams.get('timeframe') || '30d'

      const startDate =
        timeframe === '7d' ? '7daysAgo' : timeframe === '90d' ? '90daysAgo' : '30daysAgo'

      const analyticsClient = getClient(credentials)
      const property = `properties/${propertyId}`

      // Fetch time-series metrics
      const [timeseriesRes] = await analyticsClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: 'today' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'engagementRate' },
          { name: 'eventCount' },
          { name: 'conversions' },
        ],
        dimensions: [{ name: 'date' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      })

      // Fetch dimensions breakdown dengan chunk max 5 per batch
      const dimensionNames = [
        'city',
        'country',
        'deviceCategory',
        'pagePath',
        'sessionSource',
        'sessionMedium',
        'browser',
        'operatingSystem',
      ]

      const chunks = chunkArray(dimensionNames, 5)

      const batchResults = await Promise.all(
        chunks.map((chunk) =>
          analyticsClient.batchRunReports({
            property,
            requests: chunk.map((dim) => ({
              dateRanges: [{ startDate, endDate: 'today' }],
              metrics: [{ name: dim === 'pagePath' ? 'screenPageViews' : 'sessions' }],
              dimensions: [{ name: dim }],
              orderBys: [
                {
                  metric: { metricName: dim === 'pagePath' ? 'screenPageViews' : 'sessions' },
                  desc: true,
                },
              ],
              limit: 10,
            })),
          }),
        ),
      )

      // Flatten all reports from all batches
      const allReports = batchResults.flatMap((res) => res[0].reports ?? [])

      // Parse timeseries
      const rawTimeseries =
        timeseriesRes.rows?.map((row) => ({
          date: row.dimensionValues?.[0]?.value ?? '',
          screenPageViews: Number(row.metricValues?.[0]?.value ?? 0),
          totalUsers: Number(row.metricValues?.[1]?.value ?? 0),
          newUsers: Number(row.metricValues?.[2]?.value ?? 0),
          sessions: Number(row.metricValues?.[3]?.value ?? 0),
          bounceRate: parseFloat((Number(row.metricValues?.[4]?.value ?? 0) * 100).toFixed(1)),
          averageSessionDuration: parseFloat(Number(row.metricValues?.[5]?.value ?? 0).toFixed(0)),
          engagementRate: parseFloat((Number(row.metricValues?.[6]?.value ?? 0) * 100).toFixed(1)),
          eventCount: Number(row.metricValues?.[7]?.value ?? 0),
          conversions: Number(row.metricValues?.[8]?.value ?? 0),
        })) ?? []

      const timeseries = fillMissingDates(rawTimeseries, startDate)

      // Parse dimensions from allReports
      const dimensions: Record<string, { value: string; count: number }[]> = {}
      allReports.forEach((report, i) => {
        const dimName = dimensionNames[i]
        dimensions[dimName] =
          report.rows?.map((row) => ({
            value: row.dimensionValues?.[0]?.value ?? '(not set)',
            count: Number(row.metricValues?.[0]?.value ?? 0),
          })) ?? []
      })

      // Aggregate totals
      const totals = timeseries.reduce(
        (acc, row) => ({
          screenPageViews: acc.screenPageViews + row.screenPageViews,
          totalUsers: acc.totalUsers + row.totalUsers,
          newUsers: acc.newUsers + row.newUsers,
          sessions: acc.sessions + row.sessions,
          bounceRate: acc.bounceRate + row.bounceRate,
          engagementRate: acc.engagementRate + row.engagementRate,
          eventCount: acc.eventCount + row.eventCount,
          conversions: acc.conversions + row.conversions,
          averageSessionDuration: acc.averageSessionDuration + row.averageSessionDuration,
        }),
        {
          screenPageViews: 0,
          totalUsers: 0,
          newUsers: 0,
          sessions: 0,
          bounceRate: 0,
          engagementRate: 0,
          eventCount: 0,
          conversions: 0,
          averageSessionDuration: 0,
        },
      )

      const count = timeseries.length || 1
      totals.bounceRate = parseFloat((totals.bounceRate / count).toFixed(1))
      totals.engagementRate = parseFloat((totals.engagementRate / count).toFixed(1))
      totals.averageSessionDuration = parseFloat((totals.averageSessionDuration / count).toFixed(0))

      const TTL_SEC = 300
      const slot = Math.floor(Date.now() / (TTL_SEC * 1000))
      const etag = `"ga-${timeframe}-${slot}"`

      return new Response(JSON.stringify({ timeseries, totals, dimensions }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `private, max-age=${TTL_SEC}, stale-while-revalidate=60`,
          ETag: etag,
        },
      })
    } catch (err: any) {
      const message = err?.message || 'Unknown error'

      if (message.includes('PERMISSION_DENIED')) {
        return Response.json(
          {
            error:
              'Permission denied. Make sure the Google Analytics Data API is enabled and the service account has been added to your GA4 property.',
            detail: message,
          },
          { status: 403 },
        )
      }

      if (message.includes('not found')) {
        return Response.json(
          {
            error: 'Property ID not found. Check GA_PROPERTY_ID in .env.',
            detail: message,
          },
          { status: 404 },
        )
      }

      return Response.json({ error: message }, { status: 500 })
    }
  },
})
