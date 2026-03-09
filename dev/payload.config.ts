import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { gaAnalyticsPlugin } from '../src/index.js'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../.env'),
})

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const databaseURL = 'file:./dev.sqlite'

const buildConfigWithMemoryDB = async () => {
  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        slug: 'posts',
        fields: [],
      },
      {
        slug: 'media',
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, 'media'),
        },
      },
    ],
    db: sqliteAdapter({
      client: {
        url: databaseURL,
      },
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      gaAnalyticsPlugin({
        enabled: true,
        credentials: {
          type: process.env.GA_ANALYTIC_TYPE!,
          privateKey: process.env.GA_ANALYTIC_PRIVATE_KEY!,
          clientEmail: process.env.GA_ANALYTIC_CLIENT_EMAIL!,
        },
        propertyId: process.env.GA_PROPERTY_ID!,
        defaultTimeframe: '30d',
        placement: ['dashboard', 'root'],
        widget: {
          title: 'Google Analytics',
        },
        access: async (user) => {
          return user ? true : false
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
