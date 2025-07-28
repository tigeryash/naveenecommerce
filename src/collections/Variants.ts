import { CollectionConfig } from 'payload'

const Variants: CollectionConfig = {
  slug: 'variants',
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
    // ... other fields
  ],
}

export default Variants
