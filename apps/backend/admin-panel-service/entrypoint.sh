#!/bin/sh

echo "Создаем схему admin_schema..."
PGPASSWORD=postgres psql -h postgres -U postgres -d lights-shop -c "CREATE SCHEMA IF NOT EXISTS admin_schema;" || echo "Схема уже существует или ошибка создания"

echo "Применяем схему БД..."
bun run db:push || echo "Ошибка при применении схемы БД"

echo "Создаем супер-администратора..."
bun run seed:admin || echo "Ошибка при создании супер-администратора"

echo "Запускаем приложение админ панели..."
exec bun run src/index.ts 