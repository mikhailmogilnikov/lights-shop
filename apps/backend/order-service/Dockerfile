FROM oven/bun:alpine as builder

WORKDIR /app

# Устанавливаем необходимые зависимости
RUN apk add --no-cache openssl

# Копируем файлы зависимостей
COPY package.json .
COPY prisma ./prisma/
COPY prisma.config.ts .
COPY tsconfig.json .

# Устанавливаем зависимости
RUN bun install

# Копируем исходный код
COPY src ./src/

# # Генерируем только Prisma клиент без выполнения миграций
# RUN bun run prisma:generate

# Финальный образ
FROM oven/bun:alpine

WORKDIR /app

# Устанавливаем OpenSSL
RUN apk add --no-cache openssl

# Копируем зависимости и исходный код
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/prisma.config.ts .
COPY --from=builder /app/src ./src

# Копируем entrypoint скрипт
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD bun fetch http://localhost:3002/health || exit 1

# Запускаем приложение
ENV PORT=3002
EXPOSE 3002

CMD ["/app/entrypoint.sh"] 