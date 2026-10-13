# Модель данных

## Решения (зафиксированы)

| # | Вопрос                     | Решение                         | Почему                                                       |
|---|----------------------------|---------------------------------|--------------------------------------------------------------|
| 1 | Клиентская форма           | Публичная, без авторизации      | Убирает 4-ю роль, страницу кабинета, лишние экраны           |
| 2 | `delivered` vs `completed` | Оба                             | `delivered` — водитель привёз; `completed` — менеджер закрыл |
| 3 | История статусов           | Да, `OrderStatusHistory`        | Дёшево, даёт «аналитику» и таймлайн                          |
| 4 | Водитель + машина          | Назначение на рейс              | Гибче, реалистичнее                                          |
| 5 | Роли                       | 3: `admin`, `manager`, `driver` | Клиент не логинится                                          |
| 6 | Тарифы                     | Таблица `PricingRule`           | Эффектнее, 1 CRUD-экран                                      |
| 7 | Расстояние                 | Вручную + кнопка OSRM           | OSRM бесплатный, fallback — ручной ввод                      |

---

## Таблицы

### `users`
```
id, email (unique), password_hash, role (admin|manager|driver),
full_name, is_active, created_at
```

### `clients`
```
id, type (legal|individual), name, inn (nullable), contact_person,
phone, email, address, created_at
```

### `drivers`
```
id, user_id (FK → users, nullable), full_name, phone,
license_number, status (available|on_route|day_off|fired), created_at
```

### `vehicles`
```
id, plate_number (unique), brand, model, vehicle_type,
capacity_kg, status (available|on_route|maintenance), created_at
```

### `routes`
```
id, from_address, to_address, distance_km, created_at
```

### `pricing_rules`
```
id, vehicle_type, base_rate, price_per_km, price_per_kg
```

### `orders`
```
id, client_id (FK), route_id (FK), driver_id (FK, nullable),
vehicle_id (FK, nullable), cargo_name, weight_kg, price,
status (new|assigned|in_progress|delivered|completed|cancelled),
source (client_form|manager_manual), created_by (FK → users),
created_at, updated_at
```

### `order_status_history`
```
id, order_id (FK), status, changed_by (FK → users, nullable),
changed_at, comment (nullable)
```

---

## Связи

```
User      1──0..1  Driver
Driver    N──0..N  Order        (через orders.driver_id)
Vehicle   N──0..N  Order        (через orders.vehicle_id)
Client    1──N     Order
Route     1──N     Order
Order     1──N     OrderStatusHistory
PricingRule       (справочник, связей нет)
```

---

## Формула цены

```
price = base_rate + (distance_km × price_per_km) + (weight_kg × price_per_kg)
```
`base_rate`, `price_per_km`, `price_per_kg` берутся из `PricingRule` по `vehicle_type`.

---

## Статусы: кто и когда меняет

| Переход                   | Кто                         | Комментарий                          |
|---------------------------|-----------------------------|--------------------------------------|
| `→ new`                   | клиент (форма) или менеджер | создание                             |
| `new → assigned`          | менеджер                    | назначил водителя + машину           |
| `assigned → in_progress`  | водитель                    | начал рейс                           |
| `in_progress → delivered` | водитель                    | привёз                               |
| `delivered → completed`   | менеджер                    | закрыл заказ                         |
| `→ cancelled`             | менеджер                    | из любого статуса, кроме `completed` |

**Автоматика при переходах:**
- `new → assigned`: `vehicle.status = on_route`, `driver.status = on_route`
- `delivered` или `cancelled`: `vehicle.status = available`, `driver.status = available`

---

## Роли и права

| Действие                         | admin | manager | driver    |
|----------------------------------|:-----:|:-------:|:---------:|
| Управление пользователями (CRUD) | ✅    | ❌     | ❌        |
| Управление тарифами              | ✅    | ❌     | ❌        |
| CRUD клиентов                    | ✅    | ✅     | ❌        |
| CRUD водителей                   | ✅    | ✅     | ❌        |
| CRUD машин                       | ✅    | ✅     | ❌        |
| Создание заказа вручную          | ✅    | ✅     | ❌        |
| Назначение водителя/машины       | ✅    | ✅     | ❌        |
| Просмотр всех заказов            | ✅    | ✅     | ❌        |
| Просмотр своих заказов           | ✅    | ✅     | ✅        |
| `assigned → in_progress`         | ✅    | ✅     | ✅ (свои) |
| `in_progress → delivered`        | ✅    | ✅     | ✅ (свои) |
| `delivered → completed`          | ✅    | ✅     | ❌        |
| Отмена заказа                    | ✅    | ✅     | ❌        |
| Публичная форма заявки           | 🌐    | 🌐     | 🌐        |

`🌐` — доступно анонимно, без логина.