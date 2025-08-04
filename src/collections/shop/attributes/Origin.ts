import { CollectionConfig } from 'payload'

export const Origin: CollectionConfig = {
  slug: 'origin',
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
      admin: {
        description: 'Where the statue was made',
      },
    },
    // ... other fields
  ],
}
