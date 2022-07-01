export type MakairaProduct<AdditionalProductData = unknown> = {
  ean: string
} & AdditionalProductData
