#!/bin/sh

echo "Создаем схему order_schema..."
PGPASSWORD=postgres psql -h postgres -U postgres -d lights-shop -c "CREATE SCHEMA IF NOT EXISTS order_schema;" || echo "Схема уже существует или ошибка создания"

echo "Запускаем миграции..."
bun run prisma:migrate || echo "Ошибка при запуске миграций"

echo "Запускаем приложение..."
exec bun run src/index.ts 