import { Hono } from 'hono';

const publicProducts = new Hono();

publicProducts.get('/', (c) => c.text('products'));

export default publicProducts;
