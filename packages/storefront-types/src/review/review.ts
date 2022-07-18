export type MakairaReview<AdditionalReviewData = unknown> = {
  id: string
  rating: number
  text: string
  product: { id: string }
} & AdditionalReviewData
