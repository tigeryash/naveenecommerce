import { AfterDeleteHook } from 'node_modules/payload/dist/collections/config/types'

export const deleteProductReviews: AfterDeleteHook = async ({ req, id }) => {
  try {
    // Find and delete all reviews associated with this product
    await req.payload.delete({
      collection: 'reviews',
      where: {
        product: {
          equals: id,
        },
      },
    })
  } catch (error) {
    req.payload.logger.error(`Error deleting reviews for product ${id}: ${error}`)
  }
}
