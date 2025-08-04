import { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',
  admin: {
    useAsTitle: 'name',
    group: 'Shop Attributes',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
