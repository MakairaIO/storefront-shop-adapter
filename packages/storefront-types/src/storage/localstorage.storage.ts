import { MakairaStorage } from './storage.interface'

export const LocalStorageSsrSafe: MakairaStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      return localStorage.setItem(key, value)
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.removeItem(key)
    }
  },
}
