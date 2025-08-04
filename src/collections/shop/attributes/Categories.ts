import type { CollectionConfig } from 'payload'

import { anyone } from '../../../access/anyone'
import { authenticated } from '../../../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Shop Attributes',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      // This allows you to create sub-categories
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id, // A category cannot be its own parent
          },
        }
      },
    },
  ],
}
