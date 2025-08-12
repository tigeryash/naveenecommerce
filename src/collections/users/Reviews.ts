import type { CollectionConfig, PayloadHandler, PayloadRequest } from 'payload'
import { authenticated } from '../../access/authenticated'
import { selfOrAdmin } from '../../access/selfOrAdmin'
import { voteReview } from './endpoints/voteReview'
import { updateProductReviewStats } from './hooks/updateProductReviewStats'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: authenticated,
    read: () => true, // Public
    update: selfOrAdmin,
    delete: selfOrAdmin,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['product', 'rating', 'user', 'helpfulCount', 'createdAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Review Images',
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
        },
      ],
    },
    {
      name: 'helpfulCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notHelpfulCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only approved reviews are shown publicly',
      },
    },
    {
      name: 'votedUsers',
      type: 'array',
      access: {
        create: () => false, // prevent manual creation
        update: () => false, // only updated via endpoint
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: ['helpful', 'notHelpful'],
          required: true,
        },
      ],
      admin: {
        hidden: true, // hide from admin UI
      },
    },
  ],
  endpoints: [
    {
      path: '/:id/vote',
      method: 'post',
      handler: voteReview,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc.approved) {
          await updateProductReviewStats(doc.product, req.payload)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        if (doc.approved) {
          await updateProductReviewStats(doc.product, req.payload)
        }
      },
    ],
  },
  timestamps: true,
}
