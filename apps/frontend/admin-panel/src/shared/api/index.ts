import type { components, paths } from './schema/generated.ts'

export { rqClient, fetchClient } from './instance'

export type ApiPaths = paths
export type ApiComponents = components['schemas']
