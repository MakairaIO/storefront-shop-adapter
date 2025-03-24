import { ContextOptions } from '../types'

function serializeValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).map(
      ([k, v]) => `${k}: ${serializeValue(v)}`
    )
    return `{ ${entries.join(', ')} }`
  }
  return String(value)
}

export function getInContextAnnotation(contextOptions: ContextOptions | null) {
  let inContext = ''
  if (contextOptions !== null) {
    const contextParams: Array<string> = []
    for (const [key, value] of Object.entries(contextOptions)) {
      contextParams.push(`${key}: ${serializeValue(value)}`)
    }

    if (contextParams.length > 0) {
      inContext = `@inContext( ${contextParams.join(', ')} )`
    }
  }

  return inContext
}
