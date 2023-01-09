import { ContextOptions } from '../types'

export function getInContextAnnotation(contextOptions: ContextOptions | null) {
  let inContext = ''
  if (contextOptions !== null) {
    const contextParams: Array<string> = []
    for (const [key, value] of Object.entries(contextOptions)) {
      contextParams.push(`${key}: ${value}`)
    }

    if (contextParams.length > 0) {
      inContext = `@inContext( ${contextParams.join(', ')} )`
    }
  }

  return inContext
}
