import type { CollectionConfig } from 'payload'
import { selfOrAdmin } from '../../access/selfOrAdmin'
import { authenticated } from '../../access/authenticated'

export const ShippingInfo: CollectionConfig = {
  slug: 'shippingInfo',
  access: {
    admin: ({ req: { user } }) => Boolean(user?.role?.includes('admin')),
    create: authenticated,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: selfOrAdmin,
  },
  admin: {
    useAsTitle: 'addressLine1',
    group: 'Orders',
    defaultColumns: ['addressLine1', 'city', 'state', 'user'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'addressName',
      type: 'text',
      label: 'Address Nickname (e.g., Home, Work)',
    },
    {
      name: 'addressLine1',
      type: 'text',
      required: true,
    },
    {
      name: 'addressLine2',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: 'Make this my default shipping address',
      defaultValue: false,
    },
  ],
}
