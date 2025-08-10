import type { CollectionConfig } from 'payload'
import { selfOrAdmin } from '../../access/selfOrAdmin'
import { authenticated } from '../../access/authenticated'

export const PaymentInfo: CollectionConfig = {
  slug: 'paymentInfo',
  access: {
    create: authenticated,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: selfOrAdmin,
  },
  admin: {
    useAsTitle: 'stripePaymentMethodId',
    group: 'Orders',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      required: true,
    },
    {
      name: 'stripePaymentMethodId',
      type: 'text',
      required: true,
    },
    {
      name: 'brand',
      type: 'text', // e.g., "Visa"
    },
    {
      name: 'last4',
      type: 'text', // last 4 digits
    },
    {
      name: 'expMonth',
      type: 'number',
    },
    {
      name: 'expYear',
      type: 'number',
    },
  ],
}
