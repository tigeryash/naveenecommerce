// collections/Sizes.ts
import type { CollectionConfig } from 'payload'

export const Sizes: CollectionConfig = {
  slug: 'sizes',
  admin: {
    useAsTitle: 'name',
    group: 'Product Variants', // New group for variant-related collections
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Size Name (e.g., Small, Medium, Large)',
    },
    // You could add a 'description' or 'order' field here if needed
  ],
}
