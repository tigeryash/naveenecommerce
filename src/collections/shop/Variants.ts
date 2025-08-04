import { CollectionConfig } from 'payload'

export const Variants: CollectionConfig = {
  slug: 'variants', // Or 'product-variants'
  admin: {
    // useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'size', 'color', 'price', 'sku', 'quantity'],
    group: 'Shop', // Or a new 'Product Management' group
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      // You might want to ensure uniqueness of product + size + color combination
    },
    {
      name: 'size',
      type: 'relationship',
      relationTo: 'sizes',
      required: true,
    },
    {
      name: 'height',
      type: 'number',
      required: true,
    },
    {
      name: 'width',
      type: 'number',
      required: true,
    },
    {
      name: 'depth',
      type: 'number',
      required: true,
    },
    {
      name: 'weight',
      type: 'number',
      required: true,
    },
    {
      name: 'color',
      type: 'relationship',
      relationTo: 'colors', // Relate to your new Colors collection
      required: true,
    },
    {
      name: 'price', // This is the price for this specific variant
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      label: 'inventory',
      type: 'collapsible',
      fields: [
        {
          name: 'sku', // Each variant should have its own SKU
          type: 'text',
          unique: true,
          required: true,
          admin: {
            description: 'Unique Stock Keeping Unit for this variant.',
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
        },

        {
          name: 'quantity', // Inventory for this specific variant
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Alert when stock falls below this',
          },
        },
      ],
    },
    {
      name: 'images', // Variant-specific images (e.g., image of the blue shirt)
      type: 'array',
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    // You might add an `onSale`, `salePrice` etc. here at the variant level
  ],
  // Add a hook to generate a readable title for the admin panel
  // This helps when looking at a list of variants
  hooks: {
    afterRead: [
      ({ doc }) => {
        // This creates a virtual 'title' for display in the admin list
        // It's not stored in the database but generated on the fly
        if (
          doc.product &&
          typeof doc.product === 'object' &&
          doc.size &&
          typeof doc.size === 'object' &&
          doc.color &&
          typeof doc.color === 'object'
        ) {
          doc.title = `${doc.product.title} (${doc.size.name} / ${doc.color.name})`
        } else if (doc.product && typeof doc.product === 'object') {
          doc.title = `${doc.product.title} Variant`
        }
        return doc
      },
    ],
  },
}
