export type MakairaResponse<ResData, ResError extends Error> = {
  data?: ResData
  error?: ResError
}
