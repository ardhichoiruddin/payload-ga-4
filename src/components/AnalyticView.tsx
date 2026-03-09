import React from 'react'
import type { CustomComponent } from 'payload'
import type { GAPluginOptions } from '../types.js'
import { AnalyticsViewClient } from './AnalyticViewClient.js'
import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps } from 'payload'

const AnalyticsViewServer: React.FC<{ widgetOptions?: GAPluginOptions['widget'] }> = ({
  widgetOptions,
}) => {
  return <AnalyticsViewClient widgetOptions={widgetOptions} />
}

// Factory dipanggil di server — aman karena tidak ada 'use client'
export const createAnalyticsView = (widgetOptions?: GAPluginOptions['widget']): CustomComponent => {
  const Widget: React.FC<AdminViewServerProps> = ({ initPageResult, params, searchParams }) => (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      visibleEntities={initPageResult.visibleEntities}
    >
      <AnalyticsViewServer widgetOptions={widgetOptions} />
    </DefaultTemplate>
  )
  return Widget as unknown as CustomComponent
}

// Default
export const AnalyticsView = createAnalyticsView()
