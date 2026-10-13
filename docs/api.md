# API — черновик

Базовый префикс: `/api`. Формат: JSON. Авторизация: httpOnly cookie (сессия в Redis).

## Публичные

| Метод | Путь                        | Описание                           |
|-------|-----------------------------|------------------------------------|
| GET   | `/health`                   | проверка работоспособности сервиса |
| POST  | `/api/public/orders`        | Создать заявку клиента             |
| GET   | `/api/public/pricing`       | Тарифы для формы                   |
| POST  | `/api/public/calc-distance` | Рассчитать расстояние через OSRM   |

## Авторизация

| Метод | Путь               | Описание             |
|-------|--------------------|----------------------|
| POST  | `/api/auth/login`  | Вход                 |
| POST  | `/api/auth/logout` | Выход                |
| GET   | `/api/auth/me`     | Текущий пользователь |

## Заказы

| Метод  | Путь                     | Роли                   | Описание                                 |
|--------|--------------------------|------------------------|------------------------------------------|
| GET    | `/api/orders`            | admin, manager         | Список (фильтры: статус, дата, водитель) |
| GET    | `/api/orders/:id`        | admin, manager         | Карточка + history                       |
| POST   | `/api/orders`            | admin, manager         | Создать                                  |
| PATCH  | `/api/orders/:id`        | admin, manager         | Редактировать                            |
| PATCH  | `/api/orders/:id/status` | admin, manager, driver | Сменить статус                           |
| PATCH  | `/api/orders/:id/assign` | admin, manager         | Назначить водителя + машину              |
| DELETE | `/api/orders/:id`        | admin, manager         | Отмена                                   |
| GET    | `/api/my/orders`         | driver                 | Свои заказы                              |

## Справочники (CRUD по шаблону)

| Ресурс       | Путь            | Роли            |
|--------------|-----------------|-----------------|
| Клиенты      | `/api/clients`  | admin, manager  |
| Водители     | `/api/drivers`  | admin, manager  |
| Машины       | `/api/vehicles` | admin, manager  |
| Тарифы       | `/api/pricing`  | admin           |
| Пользователи | `/api/users`    | admin           |

Для каждого: `GET` (список), `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id`.

## Профиль

| Метод | Путь           | Описание         |
|-------|----------------|------------------|
| GET   | `/api/profile` | Свой профиль     |
| PATCH | `/api/profile` | Обновить профиль |

## Dashboard

| Метод | Путь                     | Описание                                             |
|-------|--------------------------|------------------------------------------------------|
| GET   | `/api/dashboard/summary` | Метрики: активные заказы, свободные машины, водители |