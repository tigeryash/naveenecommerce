// collections/users/hooks/updateProductReviewStats.ts
export async function updateProductReviewStats(productId: string, payload: any) {
  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      product: { equals: productId },
      approved: { equals: true },
    },
    limit: 0,
  })

  const totalReviews = reviews.totalDocs
  const ratingSum = reviews.docs.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = totalReviews > 0 ? ratingSum / totalReviews : 0

  const distribution = [1, 2, 3, 4, 5].map((stars) => ({
    stars,
    count: reviews.docs.filter((r) => r.rating === stars).length,
  }))

  await payload.update({
    collection: 'products',
    id: productId,
    data: {
      totalReviews,
      averageRating,
      ratingDistribution: distribution,
    },
  })
}
