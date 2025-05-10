FROM oven/bun:latest as builder

WORKDIR /app

# Устанавливаем необходимые зависимости
RUN apt-get update -y && apt-get install -y openssl

# Копируем файлы зависимостей
COPY package.json .
COPY prisma ./prisma/
COPY prisma.config.ts .
COPY tsconfig.json .

# Устанавливаем зависимости
RUN bun install

# Копируем исходный код
COPY src ./src/

# Генерируем Prisma клиент
RUN bunx prisma generate

# Финальный образ
FROM oven/bun:latest

WORKDIR /app

# Устанавливаем OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Копируем зависимости и исходный код
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/src ./src

# Проверка здоровья приложения
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD bun fetch http://localhost:3002/health || exit 1

# Запускаем приложение
ENV PORT=3002
EXPOSE 3002

CMD ["bun", "run", "src/index.ts"] 