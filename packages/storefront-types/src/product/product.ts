export type MakairaProduct<AdditionalProductData = unknown> = {
  id: string
  title: string
  url: string
  price: number
  images: string[]
  attributes?: { key: string; value: string }[]
} & AdditionalProductData
