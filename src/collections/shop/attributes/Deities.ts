import { CollectionConfig } from 'payload'

const Deities: CollectionConfig = {
  slug: 'deities',
  admin: {
    useAsTitle: 'name',
    group: 'Shop Attributes', // You might create a new group for these
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'richText', // Optional: add a description for each deity
      localized: true,
    },
    // You could add an image field here for the deity itself if needed
  ],
}

export default Deities
