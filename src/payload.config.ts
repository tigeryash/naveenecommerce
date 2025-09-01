// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
// import { migrations } from './migrations'

import { Users } from './collections/auth/users/Users'
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
import { Accounts } from './collections/auth/Account'
import { Sessions } from './collections/auth/Sessions'
import { Verifications } from './collections/auth/Verifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    routes: {
      login: '/auth/sign-in',
      createFirstUser: '/auth/sign-up',
      forgot: '/auth/forgot-password',
      reset: '/auth/reset-password',
      logout: '/auth/sign-out',
      // account: "/auth/settings" // Optional if you want to change Payload's account setting page in the admin dashboard
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
    Accounts,
    Sessions,
    Verifications,
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
