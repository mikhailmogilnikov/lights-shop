import { Hono } from 'hono';

import { internalAuth } from '../../middlewares/internalAuth';

const internalProducts = new Hono();

internalProducts.use('*', internalAuth);

internalProducts.post('/', (c) => c.text('new product'));

internalProducts.put('/:id', (c) => c.text('update product'));

internalProducts.delete('/:id', (c) => c.text('delete product'));

export default internalProducts;
