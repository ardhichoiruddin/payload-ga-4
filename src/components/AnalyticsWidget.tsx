import type { CustomComponent } from 'payload'
import type { GAPluginOptions } from '../types.js'
import { AnalyticsWidgetClient } from './AnalyticsWidgetClient.js'

const AnalyticsWidgetServer: React.FC<{ widgetOptions?: GAPluginOptions['widget'] }> = ({
  widgetOptions,
}) => {
  return <AnalyticsWidgetClient widgetOptions={widgetOptions} />
}

// Factory dipanggil di server — aman karena tidak ada 'use client'
export const createAnalyticsWidget = (
  widgetOptions?: GAPluginOptions['widget'],
): CustomComponent => {
  const Widget: React.FC = () => <AnalyticsWidgetServer widgetOptions={widgetOptions} />
  return Widget as unknown as CustomComponent
}

// Default
export const AnalyticsWidget = createAnalyticsWidget()
