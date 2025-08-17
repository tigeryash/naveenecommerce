import { CollectionConfig } from 'payload'
import { authenticated } from '../../../access/authenticated'
import { authenticatedOrPublished } from '../../../access/authenticatedOrPublished'
import { revalidateDelete, revalidatePost } from './hooks/revalidateProduct'
import { populateAuthors } from './hooks/populateAuthors'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { deleteProductReviews } from './hooks/deleteProductReviews'

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'inventory.quantity', 'status'],
    group: 'Shop',
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
      name: 'origin',
      type: 'relationship',
      relationTo: 'origin',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deity',
      type: 'relationship',
      relationTo: 'deities',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true, // A statue could be brass and wood
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'finishes',
      type: 'relationship',
      relationTo: 'finishes',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'variants',
      type: 'relationship',
      relationTo: 'variants',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          product: {
            equals: id,
          },
        }
      },
    },
    {
      name: 'totalReviews',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'averageRating',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ratingDistribution',
      type: 'array',
      fields: [
        { name: 'stars', type: 'number' }, // 1-5
        { name: 'count', type: 'number' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),

        MetaDescriptionField({}),
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
    afterDelete: [revalidateDelete, deleteProductReviews],
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
