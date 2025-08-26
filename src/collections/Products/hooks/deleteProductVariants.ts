import { CollectionAfterDeleteHook } from 'payload'

export const deleteProductVariants: CollectionAfterDeleteHook = async ({ req, id }) => {
  try {
    // Find all variants that belong to the deleted product
    const variantsToDelete = await req.payload.find({
      collection: 'variants',
      where: {
        product: {
          equals: id,
        },
      },
      limit: 500, // Adjust limit as needed
    })

    // Delete each variant
    await Promise.all(
      variantsToDelete.docs.map(async (doc) => {
        await req.payload.delete({
          collection: 'variants',
          id: doc.id,
        })
      }),
    )
  } catch (err) {
    req.payload.logger.error(`Error deleting variants for product ${id}: ${err}`)
  }
}
