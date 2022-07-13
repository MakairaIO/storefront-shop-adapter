export type MakairaResponse<ResData, ResRawData, ResError extends Error> = {
  data?: ResData
  raw?: ResRawData
  error?: ResError
}
