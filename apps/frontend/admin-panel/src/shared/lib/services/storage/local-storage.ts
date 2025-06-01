import TypedLocalStore from 'typed-local-store'
import type { Token } from '@/shared/model/session'

export interface LocalStorageSchema {
  token: Token
}

export const LocalStorageService = new TypedLocalStore<LocalStorageSchema>({
  storage: 'localStorage',
})
