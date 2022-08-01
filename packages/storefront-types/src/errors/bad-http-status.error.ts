export class BadHttpStatusError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'BadHttpStatusError'
  }
}
