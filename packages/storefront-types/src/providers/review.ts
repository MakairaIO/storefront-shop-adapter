import { MakairaShopProviderInteractor } from '../general'
import { MakairaReview } from '../review'

//#region type definition: getReviews
export type MakairaGetReviewsInput<AdditionalInput = unknown> = {
  product: { id: string }
  pagination?: { limit?: number; offset?: number }
} & AdditionalInput

export type MakairaGetReviewsResData = {
  items: { review: MakairaReview }[]
}

export type MakairaGetReviews<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetReviewsInput<AdditionalInput>,
  MakairaGetReviewsResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: createReview
export type MakairaCreateReviewInput<AdditionalInput = unknown> = {
  review: Omit<MakairaReview, 'id'>
} & AdditionalInput

export type MakairaCreateReviewResData = {
  review: MakairaReview
}

export type MakairaCreateReview<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaCreateReviewInput<AdditionalInput>,
  MakairaCreateReviewResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: provider review
export type MakairaShopProviderReview = {
  getReviews: MakairaGetReviews
  createReview: MakairaCreateReview
}
