export type MakairaProduct<AdditionalProductData = unknown> = {
  ean: string
  name: string
  price: number
} & AdditionalProductData
