import { CollectionAfterChangeHook } from 'payload'
import { updateProductReviewStats } from './updateProductReviewStats'

export const recalculateStats: CollectionAfterChangeHook = async ({
  doc, // The full document after change
  previousDoc, // The full document before change
  operation,
  req,
}) => {
  // A set of conditions under which we need to trigger a recalculation
  const needsRecalculation =
    // 1. A new review was created and is approved
    (operation === 'create' && doc.approved) ||
    // 2. A review's 'approved' status changed
    (operation === 'update' && doc.approved !== previousDoc.approved) ||
    // 3. A review's rating changed while it was (and still is) approved
    (operation === 'update' && doc.approved && doc.rating !== previousDoc.rating)

  if (needsRecalculation) {
    await updateProductReviewStats(doc.product, req.payload)
  }
}
