import createFetchClient from 'openapi-fetch'
import createReactQueryClient from 'openapi-react-query'

import { CONFIG } from '../config/configuration'
import { useSession } from '../model/session'
import type { ApiPaths } from '.'

export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_URL,
})

export const rqClient = createReactQueryClient(fetchClient)

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_URL,
})

export const publicRqClient = createReactQueryClient(publicFetchClient)

fetchClient.use({
  onRequest: ({ request }) => {
    const token = useSession.getState().token
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
  },
})
