import { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateDelete, revalidatePost } from './hooks/revalidateProduct'
import { populateAuthors } from './hooks/populateAuthors'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title', // This field shows in admin list
    defaultColumns: ['title', 'price', 'inventory.quantity', 'status'],
    group: 'Shop', // Groups collections in admin sidebar
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'products',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'products',
        req,
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // If you want translations
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of name',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Brief description for listings',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      maxRows: 10,
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

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Deity',
          fields: [
            {
              name: 'deity',
              type: 'select',
              options: [
                { label: 'Ganesha', value: 'ganesha' },
                { label: 'Shiva', value: 'shiva' },
                { label: 'Krishna', value: 'krishna' },
                { label: 'Lakshmi', value: 'lakshmi' },
                { label: 'Hanuman', value: 'hanuman' },
                { label: 'Durga', value: 'durga' },
              ],
              required: true,
            },
          ],
        },
        {
          label: 'Materials',
          fields: [
            {
              name: 'material',
              type: 'select',
              options: [
                { label: 'Brass', value: 'brass' },
                { label: 'Bronze', value: 'bronze' },
                { label: 'Marble', value: 'marble' },
                { label: 'Resin', value: 'resin' },
                { label: 'Wood', value: 'wood' },
              ],
              required: true,
            },
            {
              name: 'finish',
              type: 'select',
              options: [
                { label: 'Polished', value: 'polished' },
                { label: 'Antique', value: 'antique' },
                { label: 'Matte', value: 'matte' },
                { label: 'Gold Plated', value: 'gold-plated' },
              ],
            },
          ],
        },
        {
          label: 'Dimensions',
          fields: [
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
          ],
        },
        {
          label: 'Origin',
          fields: [
            {
              name: 'origin',
              type: 'text',
              admin: {
                description: 'Where the statue was made',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'inventory',
      type: 'group',
      fields: [
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'sku',
          type: 'text',
          unique: true,
          admin: {
            description: 'Stock keeping unit',
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Alert when stock falls below this',
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

export default Products
