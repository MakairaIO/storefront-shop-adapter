export type MakairaProduct<AdditionalProductData = unknown> = {
  id: string
  name: string
  price: number
} & AdditionalProductData
