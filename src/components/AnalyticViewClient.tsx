'use client'
import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { MetricCard } from './MetricCard.js'
import { MetricsTable } from './MetricsTable.js'
import { DimensionsTable } from './DimensionsTable.js'
import type { GAPluginOptions } from '../types.js'
import { useStepNav } from '@payloadcms/ui'
import { useAuth } from '@payloadcms/ui'

const METRIC_CARDS = [
  {
    key: 'screenPageViews',
    label: 'Page Views',
    description: 'Total page views',
    color: '#3b82f6',
  },
  { key: 'totalUsers', label: 'Total Users', description: 'Unique users', color: '#10b981' },
  { key: 'sessions', label: 'Sessions', description: 'Number of sessions', color: '#f59e0b' },
  { key: 'newUsers', label: 'New Users', description: 'New user', color: '#8b5cf6' },
  {
    key: 'bounceRate',
    label: 'Bounce Rate',
    description: 'Average bounce rate',
    color: '#ef4444',
    unit: '%',
  },
  {
    key: 'engagementRate',
    label: 'Engagement Rate',
    description: 'Engagement rate',
    color: '#06b6d4',
    unit: '%',
  },
  { key: 'eventCount', label: 'Events', description: 'Total events', color: '#ec4899' },
  { key: 'conversions', label: 'Conversions', description: 'Total conversions', color: '#14b8a6' },
  {
    key: 'averageSessionDuration',
    label: 'Avg. Duration',
    description: 'Average session duration',
    color: '#6366f1',
    unit: 's',
  },
]

const CHART_LINES = [
  { key: 'screenPageViews', color: '#3b82f6', label: 'Page Views' },
  { key: 'totalUsers', color: '#10b981', label: 'Users' },
  { key: 'sessions', color: '#f59e0b', label: 'Sessions' },
]

type Timeframe = '7d' | '30d' | '90d'

interface Props {
  widgetOptions?: GAPluginOptions['widget']
}

export const AnalyticsViewClient: React.FC<Props> = ({ widgetOptions }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>(widgetOptions?.timeframe ?? '30d')
  const [timeseries, setTimeseries] = useState<any[]>([])
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [dimensions, setDimensions] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'dimensions'>('overview')

  const { setStepNav } = useStepNav()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/admin/login'
      return
    }
  }, [user])

  useEffect(() => {
    setStepNav([
      {
        label: widgetOptions?.title ?? 'Analytic',
        url: '/admin/analytics',
      },
    ])
    setLoading(true)
    setError(null)
    fetch(`/api/ga-analytics/report?timeframe=${timeframe}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTimeseries(data.timeseries || [])
        setTotals(data.totals || {})
        setDimensions(data.dimensions || {})
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [timeframe])

  const tabs = [
    { key: 'overview', label: '📈 Overview' },
    { key: 'metrics', label: '📊 Metrics' },
    { key: 'dimensions', label: '🗂️ Dimensions' },
  ]

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: 'var(--theme-elevation-0)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--theme-text)' }}>
            Data from Google Analytics 4 · Last ·{' '}
            {timeframe === '7d' ? '7' : timeframe === '30d' ? '30' : '90'} days
          </p>
        </div>

        {/* Timeframe buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['7d', '30d', '90d'] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
                background: timeframe === t ? '#3b82f6' : '#ffffff',
                color: timeframe === t ? '#ffffff' : '#374151',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                transition: 'all 0.15s',
              }}
            >
              {t === '7d' ? '7 Hari' : t === '30d' ? '30 Hari' : '90 Hari'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--theme-elevation-0)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color:
                activeTab === tab.key ? 'var(--theme-success-700)' : 'var(--theme-elevation-700)',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid var(--theme-success-700)'
                  : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'var(--theme-elevation-50',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: 'var(--theme-text)',
            marginBottom: '1.5rem',
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--theme-text)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          Loading Analytics data...
        </div>
      )}

      {/* TAB: Overview */}
      {!loading && !error && activeTab === 'overview' && (
        <div>
          {/* Metric Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {METRIC_CARDS.map((m) => (
              <MetricCard
                key={m.key}
                label={m.label}
                description={m.description}
                value={totals[m.key]?.toLocaleString() ?? '0'}
                unit={m.unit}
                color={m.color}
              />
            ))}
          </div>

          {/* Line Chart */}
          <div
            style={{
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-50)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h2
              style={{
                margin: '0 0 1rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--theme-text)',
              }}
            >
              📈 Trend: Views, Users & Sessions
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-elevation-400)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--theme-elevation-700)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--theme-elevation-700)' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--theme-elevation-50)',
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--theme-elevation-50)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                {CHART_LINES.map((l) => (
                  <Line
                    key={l.key}
                    type="monotone"
                    dataKey={l.key}
                    stroke={l.color}
                    name={l.label}
                    strokeWidth={2}
                    dot={{
                      fill: l.color,
                    }}
                    activeDot={{
                      stroke: l.color,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bounce Rate & Engagement Rate Chart */}
          <div
            style={{
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-50)',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h2
              style={{
                margin: '0 0 1rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--theme-text)',
              }}
            >
              📉 Bounce Rate vs Engagement Rate (%)
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-elevation-400)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--theme-elevation-700)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--theme-elevation-700)' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--theme-elevation-50)',
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--theme-elevation-50)',
                  }}
                  formatter={(val: any) => `${val}%`}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line
                  type="monotone"
                  dataKey="bounceRate"
                  stroke="#ef4444"
                  name="Bounce Rate"
                  strokeWidth={2}
                  dot={{
                    fill: '#ef4444',
                  }}
                  activeDot={{
                    stroke: '#ef4444',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagementRate"
                  stroke="#06b6d4"
                  name="Engagement Rate"
                  strokeWidth={2}
                  dot={{
                    fill: '#06b6d4',
                  }}
                  activeDot={{
                    stroke: '#06b6d4',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB: Metrics */}
      {!loading && !error && activeTab === 'metrics' && (
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-50)',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <MetricsTable totals={totals} />
        </div>
      )}

      {/* TAB: Dimensions */}
      {!loading && !error && activeTab === 'dimensions' && (
        <div
          style={{
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-50)',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <DimensionsTable dimensions={dimensions} />
        </div>
      )}
    </div>
  )
}
