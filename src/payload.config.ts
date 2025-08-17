// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
// import { migrations } from './migrations'

import { Users } from './collections/users/Users'
import { Media } from './collections/Media'
import Products from './collections/Products'
import { Variants } from './collections/shop/Variants'
import { Sizes } from './collections/shop/attributes/Sizes'
import Finishes from './collections/shop/attributes/Finishes'
import Deities from './collections/shop/attributes/Deities'
import { Categories } from './collections/shop/attributes/Categories'
import Materials from './collections/shop/attributes/Materials'
import { Colors } from './collections/shop/attributes/Colors'
import { Origin } from './collections/shop/attributes/Origin'
import { Orders } from './collections/orders/Orders'
import { ShippingInfo } from './collections/orders/ShippingInfo'
import { PaymentInfo } from './collections/orders/PaymentInfo'
import { Reviews } from './collections/reviews/Reviews'
import { Discounts } from './collections/shop/Discounts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Variants,
    Sizes,
    Materials,
    Finishes,
    Deities,
    Categories,
    Colors,
    Origin,
    Discounts,
    Orders,
    ShippingInfo,
    PaymentInfo,
    Reviews,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
