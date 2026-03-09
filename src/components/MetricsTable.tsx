'use client'

const METRICS_META = [
  {
    name: 'screenPageViews',
    label: 'Screen Page Views',
    description: 'Total page views',
    unit: '',
  },
  { name: 'totalUsers', label: 'Total Users', description: 'Unique users', unit: '' },
  { name: 'newUsers', label: 'New Users', description: 'User baru', unit: '' },
  { name: 'sessions', label: 'Sessions', description: 'Jumlah sesi', unit: '' },
  { name: 'bounceRate', label: 'Bounce Rate', description: 'Bounce rate', unit: '%' },
  {
    name: 'averageSessionDuration',
    label: 'Avg. Session Duration',
    description: 'Rata-rata durasi sesi',
    unit: 's',
  },
  { name: 'engagementRate', label: 'Engagement Rate', description: 'Engagement rate', unit: '%' },
  { name: 'eventCount', label: 'Event Count', description: 'Total events', unit: '' },
  { name: 'conversions', label: 'Conversions', description: 'Total konversi', unit: '' },
]

interface Props {
  totals: Record<string, number>
}

export const MetricsTable = ({ totals }: Props) => (
  <div>
    <h2
      style={{
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: 'var(--theme-text)',
      }}
    >
      📊 Metrics Overview
    </h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
      <thead>
        <tr style={{ background: 'var(--theme-elevation-50)' }}>
          {['Metric Name', 'Description', 'Value'].map((h) => (
            <th
              key={h}
              style={{
                textAlign: 'left',
                padding: '0.6rem 1rem',
                borderBottom: '1px solid var(--theme-elevation-50)',
                color: 'var(--theme-text)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {METRICS_META.map((m, i) => (
          <tr
            key={m.name}
            style={{
              background: i % 2 === 0 ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
            }}
          >
            <td
              style={{
                padding: '0.65rem 1rem',
                borderBottom: '1px solid var(--theme-elevation-50)',
              }}
            >
              <code
                style={{
                  background: 'var(--theme-success-500)',
                  color: '#fff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                }}
              >
                {m.name}
              </code>
            </td>
            <td
              style={{
                padding: '0.65rem 1rem',
                borderBottom: '1px solid var(--theme-elevation-50)',
                color: 'var(--theme-text)',
              }}
            >
              {m.description}
            </td>
            <td
              style={{
                padding: '0.65rem 1rem',
                borderBottom: '1px solid var(--theme-elevation-50)',
                fontWeight: 600,
                color: 'var(--theme-text)',
              }}
            >
              {totals[m.name]?.toLocaleString() ?? '0'}
              {m.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
