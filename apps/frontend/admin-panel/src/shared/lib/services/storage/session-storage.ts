import TypedLocalStore from 'typed-local-store'

export interface SessionStorageSchema {}

export const SessionStorageService = new TypedLocalStore<SessionStorageSchema>({
  storage: 'sessionStorage',
})
