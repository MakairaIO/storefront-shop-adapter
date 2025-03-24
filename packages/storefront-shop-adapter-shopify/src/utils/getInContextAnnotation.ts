import { ContextOptions } from '../types'

export function getInContextAnnotation(
  contextOptions: ContextOptions | null
): string {
  if (!contextOptions) return ''

  const params: string[] = []

  if (contextOptions.language)
    params.push(`language: ${contextOptions.language}`)
  if (contextOptions.country) params.push(`country: ${contextOptions.country}`)
  if (contextOptions.buyer) {
    const { customerAccessToken, companyLocationId } = contextOptions.buyer
    const buyerParams = [`customerAccessToken: "${customerAccessToken}"`]
    if (companyLocationId)
      buyerParams.push(`companyLocationId: "${companyLocationId}"`)
    params.push(`buyer: { ${buyerParams.join(', ')} }`)
  }

  return params.length > 0 ? `@inContext( ${params.join(', ')} )` : ''
}
