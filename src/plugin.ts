import type { Config, CustomComponent } from 'payload'
import type { GAPluginOptions, PlacementSlot } from './types.js'
import { createAnalyticsEndpoint } from './endpoints/customEndpointHandler.js'
import { createAnalyticsView } from './components/AnalyticView.js'
import { createAnalyticsWidget } from './components/AnalyticsWidget.js'
import { createNavLink } from './components/NavLink.js'

export const payloadGa4 =
  (options: GAPluginOptions) =>
  (incomingConfig: Config): Config => {
    if (options.enabled === false) return incomingConfig

    const AnalyticWidgetComponent: CustomComponent = createAnalyticsWidget(options.widget)
    const AnalyticComponent: CustomComponent = createAnalyticsView(options.widget)
    const NavLinkComponent: CustomComponent = createNavLink(options.widget)

    const placements: PlacementSlot[] = options.placement
      ? Array.isArray(options.placement)
        ? options.placement
        : [options.placement]
      : ['root']

    let config: Config = {
      ...incomingConfig,
      endpoints: [
        ...(incomingConfig.endpoints || []),
        createAnalyticsEndpoint(options.credentials, options.propertyId),
      ],
    }

    for (const slot of placements) {
      if (slot === 'root') {
        config = {
          ...config,
          admin: {
            ...config.admin,
            components: {
              ...config.admin?.components,
              afterNavLinks: [...(config.admin?.components?.afterNavLinks || []), NavLinkComponent],
              views: {
                ...config.admin?.components?.views,
                gaAnalytics: {
                  Component: AnalyticComponent,
                  path: (options?.path ?? '/analytics') as `/${string}`,
                },
              },
            },
          },
        }
      }

      if (slot === 'dashboard') {
        config = {
          ...config,
          admin: {
            ...config.admin,
            components: {
              ...config.admin?.components,
              beforeDashboard: [
                ...(config.admin?.components?.beforeDashboard || []),
                AnalyticWidgetComponent,
              ],
            },
          },
        }
      }

      // ── collection: inject to list/edit view ─────────────────
      if (typeof slot === 'object' && 'collection' in slot) {
        const position = slot.position ?? 'beforeList'

        const collections = (config.collections || []).map((col) => {
          if (col.slug !== slot.collection) return col

          // Map position ke slot yang benar di Payload
          const componentSlotMap: Record<string, string> = {
            beforeList: 'beforeListTable',
            afterList: 'afterListTable',
            beforeEdit: 'beforeDocumentControls',
            afterEdit: 'afterDocumentControls',
          }
          const componentSlot = componentSlotMap[position]

          return {
            ...col,
            admin: {
              ...col.admin,
              components: {
                ...col.admin?.components,
                [componentSlot]: [
                  ...((col.admin?.components as any)?.[componentSlot] || []),
                  AnalyticWidgetComponent,
                ],
              },
            },
          }
        })

        config = { ...config, collections }
      }

      // ── global: inject to edit view ──────────────────────────
      if (typeof slot === 'object' && 'global' in slot) {
        const position = slot.position ?? 'beforeEdit'
        const componentSlot =
          position === 'beforeEdit' ? 'beforeDocumentControls' : 'afterDocumentControls'

        const globals = (config.globals || []).map((g) => {
          if (g.slug !== slot.global) return g
          return {
            ...g,
            admin: {
              ...g.admin,
              components: {
                ...g.admin?.components,
                [componentSlot]: [
                  ...((g.admin?.components as any)?.[componentSlot] || []),
                  AnalyticWidgetComponent,
                ],
              },
            },
          }
        })

        config = { ...config, globals }
      }
    }

    return config
  }
