import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { selfOrAdmin } from '../../access/selfOrAdmin'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: authenticated,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: selfOrAdmin,
  },
  admin: {
    useAsTitle: 'id',
    group: 'Orders',
    defaultColumns: ['status', 'total', 'user', 'createdAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      defaultValue: 'pending',
    },
    {
      name: 'stripeSessionId',
      type: 'text',
    },
    {
      name: 'shippingInfo',
      type: 'relationship',
      relationTo: 'shippingInfo',
    },
    {
      name: 'paymentInfo',
      type: 'relationship',
      relationTo: 'paymentInfo',
    },
  ],
  timestamps: true,
}
