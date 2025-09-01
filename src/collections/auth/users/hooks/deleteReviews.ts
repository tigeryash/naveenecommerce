import { updateProductReviewStats } from '@/collections/reviews/hooks/updateProductReviewStats'
import { AfterDeleteHook } from 'node_modules/payload/dist/collections/config/types'

export const deleteUserReviews: AfterDeleteHook = async ({ req, id }) => {
  try {
    // Step 1: Find all reviews written by the deleted user
    const reviews = await req.payload.find({
      collection: 'reviews',
      where: {
        user: {
          equals: id,
        },
      },
      // We only need the review ID and the product ID
      depth: 0,
      limit: 1000, // Adjust if a user can have more reviews
    })

    if (reviews.docs.length > 0) {
      const productIdsToUpdate = new Set<string>()
      const reviewIdsToDelete = reviews.docs.map((review) => {
        // Collect the unique product IDs whose stats we need to recalculate
        if (review.product) {
          const productId = typeof review.product === 'object' ? review.product.id : review.product
          productIdsToUpdate.add(String(productId))
        }
        return review.id
      })

      // Step 2: Delete all those reviews
      await req.payload.delete({
        collection: 'reviews',
        where: {
          id: {
            in: reviewIdsToDelete,
          },
        },
      })

      // Step 3: Recalculate stats for each affected product
      // We reuse your existing function here!
      for (const productId of productIdsToUpdate) {
        await updateProductReviewStats(productId, req.payload)
      }
    }
  } catch (error) {
    req.payload.logger.error(`Error deleting reviews for user ${id}: ${error}`)
  }
}
