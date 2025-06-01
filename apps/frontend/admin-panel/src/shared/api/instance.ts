import createFetchClient from 'openapi-fetch'
import createReactQueryClient from 'openapi-react-query'

import { CONFIG } from '../config/configuration'
import { LocalStorageService } from '../lib/services/storage'
import type { ApiPaths } from '.'

const getToken = () => {
  const token = LocalStorageService.getItem('token', 'safe')
  return token ? `Bearer ${token}` : undefined
}

export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_URL,
  headers: {
    Authorization: getToken(),
  },
})

export const rqClient = createReactQueryClient(fetchClient)
