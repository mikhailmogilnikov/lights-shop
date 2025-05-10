# Lights Shop

<b>[Online Shop](https://lights-shop.vercel.app)</b>

## Features

- **TypeScript** - For type safety and improved developer experience
- **SvelteKit** - Web framework for building Svelte apps
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Hono** - Lightweight, performant server framework
- **Microservices** - Modular backend architecture
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Docker** - Containerization for consistent deployments
- **Environment Variables** - Centralized configuration management

## Microservices Architecture

The application is built using a microservices approach:

1. **Product Service** - Manages product catalog and inventory
   - CRUD operations for products
   - Stock management
   - Internal API for other services

2. **Order Service** - Handles order processing
   - Order creation and management
   - Integration with Product Service for inventory updates
   - Order status tracking

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database settings
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=lights-shop
POSTGRES_PORT=5433

# Service ports
PRODUCT_SERVICE_PORT=3001
ORDER_SERVICE_PORT=3002

# Internal authorization
INTERNAL_API_KEY=internal-api-key-secret

# Service URLs
PRODUCT_SERVICE_URL=http://product-service:3001
ORDER_SERVICE_URL=http://order-service:3002

# Database connection
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/lights-shop
```

## Running with Docker

The easiest way to run the entire application is with Docker Compose:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## Running for Development

For local development without Docker:

```bash
# Start PostgreSQL
bun run docker:up

# Generate Prisma clients
bun run prisma:generate:all

# Push database schema
bun run db:push

# Start services in development mode
bun run dev
```

## Project Structure

```
lights-shop/
├── apps/
│   ├── backend/
│   │   ├── product-service/  # Product management microservice
│   │   │   ├── prisma/       # Database schema and client
│   │   │   └── src/          # Service implementation
│   │   │
│   │   └── order-service/    # Order processing microservice
│   │       ├── prisma/       # Database schema and client
│   │       └── src/          # Service implementation
│   │
│   └── frontend/
│       └── shop/             # Customer-facing web application
│
├── docker-compose.yml        # Docker configuration
└── .env                      # Environment variables
```

## API Documentation

### Product Service (Port 3001)

- `GET /health` - Health check endpoint
- `GET /products` - Get all products

**Internal API** (Protected):
- `POST /_internal/products` - Create product
- `PUT /_internal/products/:id` - Update product
- `DELETE /_internal/products/:id` - Delete product

### Order Service (Port 3002)

- `GET /health` - Health check endpoint
- `POST /orders` - Create a new order

**Internal API** (Protected):
- `GET /_internal/orders` - Get all orders 
- `GET /_internal/orders/:id` - Get order details
- `PATCH /_internal/orders/:id/status` - Update order status

## Security

Internal API endpoints (`/_internal/*`) are protected with API key authentication. Services communicate using the `InternalApiClient` which automatically adds the required authentication headers.
