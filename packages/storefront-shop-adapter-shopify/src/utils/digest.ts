export async function digest(message: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message))
    )
  )
    .map((char) => ('0' + char.toString(16)).slice(-2))
    .join('')
}
