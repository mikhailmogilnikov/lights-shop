FROM oven/bun:alpine as builder

WORKDIR /app

RUN apk add --no-cache openssl

# Копируем файлы зависимостей
COPY package.json .
COPY prisma ./prisma/
COPY tsconfig.json .

RUN bun install

# Копируем исходный код
COPY src ./src/

# Финальный образ
FROM oven/bun:alpine

WORKDIR /app

# Устанавливаем OpenSSL для Prisma и postgresql-client для psql
RUN apk add --no-cache openssl postgresql-client

# Копируем зависимости и исходный код
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/src ./src

# Копируем entrypoint скрипт
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD bun fetch http://localhost:3003/health || exit 1

# Запускаем приложение
ENV PORT=3003
EXPOSE 3003

CMD ["/app/entrypoint.sh"] 