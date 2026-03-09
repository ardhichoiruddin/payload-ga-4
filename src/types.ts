/**
 * Configuration options for the Google Analytics plugin.
 */
export interface GAPluginOptions {
  /** Whether to enable the plugin (default: false). */
  enabled?: boolean

  /** GA4 property ID to use for analytics data. */
  propertyId: string

  /** Default timeframe for data (7d, 30d, or 90d). */
  defaultTimeframe?: '7d' | '30d' | '90d'

  /** Google service account credentials. */
  credentials: {
    /** Credential type (always 'serviceAccount'). */
    type: string
    /** Private key from JSON file. */
    privateKey: string
    /** Service account client email. */
    clientEmail: string
  }

  /** Widget placement slots (root, dashboard, collection, global). */
  placement?: PlacementSlot | PlacementSlot[]

  /** Access control function based on user. */
  access?: (user: any) => boolean | Promise<boolean>

  /** Analytics widget options. */
  widget?: {
    /** Widget title. */
    title?: string
    /** Widget timeframe period. */
    timeframe?: '7d' | '30d' | '90d'
    /** Detailed analytics view path. */
    detailPath?: string
  }

  /** Custom path for analytics view (/analytics). */
  path?: string
}

export type PlacementSlot =
  | 'root'
  | 'dashboard'
  | { collection: string; position?: 'beforeList' | 'afterList' | 'beforeEdit' | 'afterEdit' }
  | { global: string; position?: 'beforeEdit' | 'afterEdit' }

export interface MetricRow {
  name: string
  value: string | number
  label: string
  description: string
}

export interface DimensionRow {
  name: string
  label: string
  description: string
  values: string[]
}

export interface ReportDataPoint {
  date: string
  screenPageViews: number
  totalUsers: number
  newUsers: number
  sessions: number
  bounceRate: number
  averageSessionDuration: number
  engagementRate: number
  eventCount: number
  conversions: number
}

export interface DimensionBreakdown {
  city: { value: string; sessions: number }[]
  country: { value: string; sessions: number }[]
  deviceCategory: { value: string; sessions: number }[]
  pagePath: { value: string; views: number }[]
  sessionSource: { value: string; sessions: number }[]
  sessionMedium: { value: string; sessions: number }[]
  browser: { value: string; sessions: number }[]
  operatingSystem: { value: string; sessions: number }[]
}
