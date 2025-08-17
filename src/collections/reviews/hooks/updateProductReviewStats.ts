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
  let ratingSum = 0
  const ratingCounts = new Map([
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
  ])

  // Calculate sum and distribution in one loop
  for (const review of reviews.docs) {
    ratingSum += review.rating
    if (ratingCounts.has(review.rating)) {
      ratingCounts.set(review.rating, ratingCounts.get(review.rating)! + 1)
    }
  }

  const averageRating = totalReviews > 0 ? ratingSum / totalReviews : 0

  const distribution = Array.from(ratingCounts.entries()).map(([stars, count]) => ({
    stars,
    count,
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
