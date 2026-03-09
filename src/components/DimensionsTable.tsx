'use client'

const DIMENSIONS_META = [
  { name: 'date', label: 'Date', description: 'Tanggal (YYYYMMDD)', format: 'date' },
  { name: 'city', label: 'City', description: 'Kota user', format: 'text' },
  { name: 'country', label: 'Country', description: 'Negara user', format: 'text' },
  {
    name: 'deviceCategory',
    label: 'Device Category',
    description: 'Desktop / Mobile / Tablet',
    format: 'text',
  },
  {
    name: 'pagePath',
    label: 'Page Path',
    description: 'URL halaman yang dikunjungi',
    format: 'text',
  },
  {
    name: 'sessionSource',
    label: 'Session Source',
    description: 'Sumber traffic (google, direct, dll.)',
    format: 'text',
  },
  {
    name: 'sessionMedium',
    label: 'Session Medium',
    description: 'Medium (organic, cpc, referral)',
    format: 'text',
  },
  { name: 'browser', label: 'Browser', description: 'Jenis browser', format: 'text' },
  { name: 'operatingSystem', label: 'OS', description: 'Operating system user', format: 'text' },
]

interface Props {
  dimensions: Record<string, { value: string; count: number }[]>
}

export const DimensionsTable = ({ dimensions }: Props) => (
  <div>
    <h2
      style={{
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: 'var(--theme-text)',
      }}
    >
      🗂️ Dimensions Breakdown
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1rem',
      }}
    >
      {DIMENSIONS_META.filter((d) => d.name !== 'date').map((dim) => {
        const rows = dimensions?.[dim.name] ?? []
        return (
          <div
            key={dim.name}
            style={{
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-50)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--theme-elevation-50)',
                borderBottom: '1px solid var(--theme-elevation-50)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <code
                  style={{
                    background: 'var(--theme-success-500)',
                    color: '#fff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                  }}
                >
                  {dim.name}
                </code>
                <span
                  style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--theme-text)' }}
                >
                  {dim.description}
                </span>
              </div>
            </div>

            {/* Rows */}
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {rows.length === 0 ? (
                <p
                  style={{
                    padding: '1rem',
                    color: 'var(--theme-text)',
                    fontSize: '0.8rem',
                    margin: 0,
                  }}
                >
                  No data available
                </p>
              ) : (
                rows.map((row, i) => {
                  const maxCount = rows[0]?.count || 1
                  const pct = Math.round((row.count / maxCount) * 100)
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem 1rem',
                        borderBottom:
                          i < rows.length - 1 ? '1px solid var(--theme-elevation-50)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--theme-text)',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.value}
                        </span>
                        <span
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--theme-text)',
                          }}
                        >
                          {row.count.toLocaleString()}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: '4px',
                          background: '#dbd9d9',
                          borderRadius: '2px',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: '#1933fa',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)
