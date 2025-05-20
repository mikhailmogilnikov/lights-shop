#!/bin/sh

echo "Запускаем миграции..."
bun run prisma:migrate || echo "Ошибка при запуске миграций"

echo "Запускаем приложение..."
exec bun run src/index.ts 