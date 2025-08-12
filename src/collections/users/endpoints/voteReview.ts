import type { PayloadHandler } from 'payload'

export const voteReview: PayloadHandler = async (req) => {
  if (!req.user) {
    return new Response(JSON.stringify({ error: 'You must be logged in to vote' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { type } = await (req as Request).json()
  const reviewId = req.routeParams?.id as string

  if (!reviewId) {
    return new Response(JSON.stringify({ error: 'Missing review ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (type !== 'helpful' && type !== 'notHelpful') {
    return new Response(JSON.stringify({ error: 'Invalid vote type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const review = await req.payload.findByID({
    collection: 'reviews',
    id: reviewId,
  })

  const existingVoteIndex = review.votedUsers?.findIndex((vote) => vote.user === req.user.id)

  let updatedHelpful = review.helpfulCount || 0
  let updatedNotHelpful = review.notHelpfulCount || 0
  let updatedVotes = [...(review.votedUsers || [])]

  if (existingVoteIndex !== -1 && existingVoteIndex !== undefined) {
    const existingVote = updatedVotes[existingVoteIndex]

    if (existingVote.type === type) {
      // Unvote
      updatedVotes.splice(existingVoteIndex, 1)
      if (type === 'helpful') updatedHelpful--
      else updatedNotHelpful--
    } else {
      // Change vote
      updatedVotes[existingVoteIndex].type = type
      if (type === 'helpful') {
        updatedHelpful++
        updatedNotHelpful--
      } else {
        updatedNotHelpful++
        updatedHelpful--
      }
    }
  } else {
    // New vote
    updatedVotes.push({ user: req.user.id, type })
    if (type === 'helpful') updatedHelpful++
    else updatedNotHelpful++
  }

  const updatedReview = await req.payload.update({
    collection: 'reviews',
    id: reviewId,
    data: {
      helpfulCount: updatedHelpful,
      notHelpfulCount: updatedNotHelpful,
      votedUsers: updatedVotes,
    },
  })

  return new Response(
    JSON.stringify({
      helpfulCount: updatedReview.helpfulCount,
      notHelpfulCount: updatedReview.notHelpfulCount,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
