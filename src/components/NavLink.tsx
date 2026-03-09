import type { CustomComponent } from 'payload'
import type { GAPluginOptions } from '../types.js'
import { NavLinkClient } from './NavLinkClient.js'

const NavLinkServer: React.FC<{ widgetOptions?: GAPluginOptions['widget'] }> = ({
  widgetOptions,
}) => {
  return <NavLinkClient widgetOptions={widgetOptions} />
}

export const createNavLink = (widgetOptions?: GAPluginOptions['widget']): CustomComponent => {
  const Widget: React.FC = () => <NavLinkServer widgetOptions={widgetOptions} />
  return Widget as unknown as CustomComponent
}

export const NavLink = createNavLink()
