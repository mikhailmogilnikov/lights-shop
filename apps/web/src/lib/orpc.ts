import type { RouterClient } from '@orpc/server';
import type { appRouter } from '../../../server/src/routers/index';

import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCSvelteQueryUtils } from '@orpc/svelte-query';
import { QueryCache, QueryClient } from '@tanstack/svelte-query';

import { PUBLIC_SERVER_URL } from '$env/static/public';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(`Error: ${error.message}`);
    },
  }),
});

export const link = new RPCLink({
  url: `${PUBLIC_SERVER_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  },
});

export const client: RouterClient<typeof appRouter> = createORPCClient(link);

export const orpc = createORPCSvelteQueryUtils(client);
