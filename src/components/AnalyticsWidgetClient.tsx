'use client'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { GAPluginOptions } from '../types.js'
import { Link } from '@payloadcms/ui'
import { usePayloadTheme } from '../hooks/usePayloadTheme.js'
import { formatGA4Date } from '../utils/formatDate.js'

interface Props {
  widgetOptions?: GAPluginOptions['widget']
}

export const AnalyticsWidgetClient: React.FC<Props> = ({ widgetOptions }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const theme = usePayloadTheme()

  useEffect(() => {
    fetch(`/api/ga-analytics/report?timeframe=${widgetOptions?.timeframe ?? '7d'}`)
      .then((res) => res.json())
      .then((res) => {
        console.log('res', res)
        setData(res)
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div
        style={{ padding: '1rem', color: 'var(--theme-text-placeholder)', fontSize: '0.875rem' }}
      >
        ⏳ Loading Analytics...
      </div>
    )

  if (data?.error)
    return (
      <div style={{ padding: '1rem', color: 'var(--theme-error)', fontSize: '0.875rem' }}>
        ❌ {data.error}
      </div>
    )

  const { totals, timeseries } = data

  return (
    <div
      style={{
        border: '1px solid var(--theme-border-color)',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        background: 'var(--theme-elevation-0)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--theme-text)' }}>
          {widgetOptions?.title ?? '📊 Google Analytics — Last 7 Days'}
        </h3>
        <Link
          href={widgetOptions?.detailPath ?? '/admin/analytics'}
          style={{ fontSize: '0.8rem', color: 'var(--theme-success)', textDecoration: 'none' }}
        >
          View Details →
        </Link>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {[
          { label: 'Views', value: totals?.screenPageViews ?? 0, color: '#3b82f6' },
          { label: 'Users', value: totals?.totalUsers ?? 0, color: '#10b981' },
          { label: 'Sessions', value: totals?.sessions ?? 0, color: '#f59e0b' },
          { label: 'Bounce Rate', value: `${totals?.bounceRate ?? 0}%`, color: '#ef4444' },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: 'var(--theme-elevation-50)',
              borderRadius: '6px',
              padding: '0.75rem',
              borderTop: `3px solid ${m.color}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.7rem',
                color: 'var(--theme-text-placeholder)',
                textTransform: 'uppercase',
              }}
            >
              {m.label}
            </p>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--theme-text)',
              }}
            >
              {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
            </p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeseries}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: theme.text }}
            tickFormatter={(d) => formatGA4Date(d, { day: '2-digit', month: 'short' })}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              fontSize: '0.75rem',
              borderRadius: '6px',
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              color: theme.tooltipText,
            }}
            labelFormatter={(d) => `${d.slice(6, 8)}/${d.slice(4, 6)}`}
          />
          <Line
            type="monotone"
            dataKey="screenPageViews"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Views"
            dot={{
              fill: '#3b82f6',
            }}
            activeDot={{
              stroke: '#3b82f6',
            }}
          />
          <Line
            type="monotone"
            dataKey="totalUsers"
            stroke="#10b981"
            strokeWidth={2}
            name="Users"
            dot={{
              fill: '#10b981',
            }}
            activeDot={{
              stroke: '#10b981',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
