import { CollectionConfig } from 'payload'

const Materials: CollectionConfig = {
  slug: 'materials',
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
    // ... other fields like 'careInstructions'
  ],
}

export default Materials
