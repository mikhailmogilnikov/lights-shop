import { useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { createGStore } from 'create-gstore'
import type { Session, Token } from './types'
import { LocalStorageService } from '@/shared/lib/services/storage'

export const useSession = createGStore(() => {
  const [token, setToken] = useState<Token | null>(
    () => LocalStorageService.getItem('token', 'safe') ?? null,
  )

  const login = (tokenValue: Token) => {
    LocalStorageService.setItem('token', tokenValue)
    setToken(tokenValue)
  }

  const logout = () => {
    LocalStorageService.removeItem('token')
    setToken(null)
  }

  const session = useMemo(() => {
    if (!token) return null
    return jwtDecode<Session>(token)
  }, [token])

  return {
    login,
    logout,
    session,
  }
})
