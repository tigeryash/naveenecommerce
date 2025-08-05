import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '@/access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },

    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      defaultValue: 'customer',
      hasMany: true,
    },
    {
      name: 'addresses',
      type: 'relationship',
      relationTo: 'shippingInfo',
      hasMany: true,
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
    },
    {
      name: 'wishList',
      type: 'relationship',
      relationTo: 'wishList',
      hasMany: true,
    },
    {
      name: 'paymentMethods',
      type: 'relationship',
      relationTo: 'paymentInfo',
      hasMany: true,
    },
  ],
  timestamps: true,
}
