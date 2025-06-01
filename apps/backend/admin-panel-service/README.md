# Admin Panel Service

Сервис админ панели для управления интернет-магазином светильников с JWT авторизацией и Prisma ORM.

## Функциональность

### Аутентификация
- JWT-авторизация для админов
- Защищенные роуты
- Управление администраторами через Prisma

### Управление администраторами
- Создание новых администраторов (только SUPER_ADMIN)
- Просмотр профилей администраторов
- Обновление данных администраторов
- Удаление администраторов (только SUPER_ADMIN)
- Роли: ADMIN, SUPER_ADMIN

### Управление продуктами (через internal API)
- Создание новых продуктов
- Обновление существующих продуктов
- Удаление продуктов
- Проверка остатков на складе
- Уменьшение количества товара

### Управление заказами (через internal API)
- Просмотр всех заказов
- Просмотр деталей заказа
- Обновление статуса заказа
- Отмена заказов

### Дашборд
- Статистика по заказам
- Общая выручка
- Последние заказы

## API Эндпоинты

### Аутентификация
- `POST /auth/login` - Вход в систему
- `POST /auth/create-admin` - Создание нового админа (требует SUPER_ADMIN)
- `GET /auth/verify` - Проверка токена

### Администраторы (требует авторизации)
- `GET /admin/admins` - Получить всех админов (только SUPER_ADMIN)
- `GET /admin/admins/:id` - Получить админа по ID
- `PUT /admin/admins/:id` - Обновить админа
- `DELETE /admin/admins/:id` - Удалить админа (только SUPER_ADMIN)

### Продукты (требует авторизации)
- `POST /admin/products` - Создать продукт
- `PUT /admin/products/:id` - Обновить продукт
- `DELETE /admin/products/:id` - Удалить продукт
- `GET /admin/products/:id/stock/:quantity` - Проверить остатки
- `POST /admin/products/:id/decrease-stock` - Уменьшить остатки

### Заказы (требует авторизации)
- `GET /admin/orders` - Получить все заказы
- `GET /admin/orders/:id` - Получить заказ по ID
- `PATCH /admin/orders/:id/status` - Обновить статус заказа
- `POST /admin/orders/:id/cancel` - Отменить заказ

### Дашборд (требует авторизации)
- `GET /admin/dashboard` - Получить статистику

## База данных

Сервис использует PostgreSQL через Prisma ORM. Создает таблицу `admins` для хранения данных администраторов.

### Модель Admin
```prisma
model Admin {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  role      AdminRole @default(ADMIN)
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## Переменные окружения

```env
PORT=3003
DATABASE_URL=postgresql://user:password@localhost:5432/lights_shop_db
PRODUCT_SERVICE_URL=http://product-service:3001
ORDER_SERVICE_URL=http://order-service:3002
INTERNAL_API_KEY=internal-secret-key
JWT_SECRET=jwt-secret-key
ADMIN_EMAIL=admin@lights-shop.com
ADMIN_PASSWORD=admin123
```

## Запуск

### Разработка
```bash
# Генерация Prisma клиента
bun run prisma:generate

# Применение схемы к БД
bun run db:push

# Создание супер-админа
bun run seed:admin

# Запуск в режиме разработки
bun run dev
```

### Продакшн
```bash
bun run build
bun run start
```

### Docker
```bash
docker build -t admin-panel-service .
docker run -p 3003:3003 admin-panel-service
```

## Начальная настройка

При первом запуске сервис автоматически:
1. Применяет схему Prisma к базе данных
2. Создает супер-администратора с данными из переменных окружения

Логин по умолчанию:
- Email: `admin@lights-shop.com`
- Password: `admin123`
- Роль: `SUPER_ADMIN`

## Безопасность

- Пароли хранятся в открытом виде (для демо). В продакшене используйте bcrypt или аналогичные библиотеки
- JWT токены действительны 24 часа
- Только SUPER_ADMIN может создавать и удалять других администраторов
- Админы могут редактировать только свой профиль (кроме SUPER_ADMIN) 