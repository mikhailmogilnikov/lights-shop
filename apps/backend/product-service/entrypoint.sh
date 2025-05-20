#!/bin/sh

echo "Запускаем миграции..."
bun run prisma:migrate || echo "Ошибка при запуске миграций"

# Проверяем, нужно ли заполнять базу данных
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Запускаем заполнение базы данных..."
  bun run seed || echo "Ошибка при заполнении базы данных"
else
  echo "Пропускаем заполнение базы данных (установите SEED_DATABASE=true для запуска)"
fi

echo "Запускаем приложение..."
exec bun run src/index.ts 