import { CollectionConfig } from 'payload'

const Finishes: CollectionConfig = {
  slug: 'finishes',
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

export default Finishes
