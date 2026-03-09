'use client'
import { Link } from '@payloadcms/ui'
import type { GAPluginOptions } from '../types.js'

interface Props {
  widgetOptions?: GAPluginOptions['widget']
}

export const NavLinkClient: React.FC<Props> = ({ widgetOptions }) => {
  const isActive = false

  return (
    <div className="nav__link-wrap">
      <Link
        href="/admin/analytics"
        className={['nav__link', isActive ? 'active' : ''].filter(Boolean).join(' ')}
        prefetch={false}
      >
        <span className="nav__link-label"> {widgetOptions?.title ?? 'Analytics'}</span>
      </Link>
    </div>
  )
}
