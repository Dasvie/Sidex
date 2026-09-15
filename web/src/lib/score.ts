/* The ranking formula, alone so it can be tested without a database.
   score = reviews × 3 + comments × 1 + replies × 0.5. No dates, no stars, no upvotes. */
export function scoreOf(n: { reviews: number; comments: number; replies: number }) {
  return n.reviews * 3 + n.comments + n.replies * 0.5;
}
