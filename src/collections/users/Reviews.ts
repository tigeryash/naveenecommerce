import type { CollectionConfig, PayloadHandler, PayloadRequest } from 'payload'
import { authenticated } from '../../access/authenticated'
import { selfOrAdmin } from '../../access/selfOrAdmin'

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
  ],
  endpoints: [
    {
      path: '/:id/vote',
      method: 'post',
      handler: (async (req: PayloadRequest) => {
        if (!req.json) {
          return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { type } = await req.json()
        const reviewId = req.routeParams?.id
        const field = type === 'helpful' ? 'helpfulCount' : 'notHelpfulCount'

        const review = await req.payload.update({
          collection: 'reviews',
          id: reviewId,
          data: {
            [field]: {
              increment: 1,
            },
          },
        })

        return new Response(
          JSON.stringify({
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }) as PayloadHandler,
    },
  ],
  timestamps: true,
}
