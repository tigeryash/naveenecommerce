import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { selfOrAdmin } from '../../access/selfOrAdmin'
import { anyone } from '@/access/anyone'
import { protectRoles } from './hooks/protectRoles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone,
    delete: selfOrAdmin,
    read: selfOrAdmin,
    update: selfOrAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    verify: true,
    cookies: {
      sameSite: 'None',
      secure: true,
      domain: 'localhost',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
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
      saveToJWT: true,
      defaultValue: ['customer'],
      hasMany: true,
      access: {
        create: () => true,
        update: ({ req: { user } }) => {
          return user?.role?.includes('admin') || false
        },
      },
      hooks: {
        beforeChange: [protectRoles],
      },
    },

    {
      name: 'wishList',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
  timestamps: true,
}
