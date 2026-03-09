'use client'

interface Props {
  label: string
  description: string
  value: string | number
  unit?: string
  color?: string
}

export const MetricCard = ({ label, description, value, unit = '', color = '#3b82f6' }: Props) => (
  <div
    style={{
      background: 'var(--theme-elevation-50)',
      borderTop: `4px solid ${color}`,
      borderRadius: '8px',
      padding: '1.2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: '0.75rem',
        color: 'var(--theme-text-placeholder)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </p>
    <h3
      style={{
        margin: '0.4rem 0 0.2rem',
        fontSize: '1.75rem',
        fontWeight: 700,
        color: 'var(--theme-text)',
      }}
    >
      {value}
      {unit}
    </h3>
    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--theme-text-placeholder)' }}>
      {description}
    </p>
  </div>
)
