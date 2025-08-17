import { User } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'

export const isVerified: CollectionBeforeChangeHook<User> = async ({ data, operation, req }) => {
  if (operation === 'create') {
    // 1. Ensure logged in
    if (!req.user) {
      throw new Error('You must be logged in to leave a review.')
    }

    // 2. Ensure only one review per user per product
    const existing = await req.payload.find({
      collection: 'reviews',
      where: {
        and: [{ user: { equals: req.user.id } }, { product: { equals: data.product } }],
      },
    })
    if (existing.totalDocs > 0) {
      throw new Error('You have already reviewed this product.')
    }

    // 3. Check verified purchase
    const orders = await req.payload.find({
      collection: 'orders',
      where: {
        and: [
          { user: { equals: req.user.id } },
          { 'items.product': { equals: data.product } },
          { status: { in: ['paid', 'delivered'] } },
        ],
      },
    })

    if (orders.totalDocs > 0) {
      data.verifiedPurchase = true
    } else {
      throw new Error('You can only review products you have purchased.')
    }
  }
  return data
}
