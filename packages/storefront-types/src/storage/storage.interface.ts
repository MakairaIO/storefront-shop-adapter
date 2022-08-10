export interface MakairaStorage {
  getItem: (keyName: string) => string | null
  setItem: (keyName: string, keyValue: string) => void
  removeItem: (keyName: string) => void
}
