import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.client import Client
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.models.route import Route
from app.models.pricing import PricingRule
from app.models.order import Order


async def seed_data():
    # Теперь таблицы создает Alembic, этот блок больше не нужен:
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Проверяем, есть ли уже водители
        result = await session.execute(select(Driver))
        if result.scalars().first():
            print("Данные уже существуют. Пропускаем.")
            return

        print("Заполняем базу тестовыми данными...")

        # ==========================================
        # 1. КЛИЕНТЫ
        # ==========================================
        clients_data = [
            {"name": "ООО «Ромашка»", "type": "legal", "inn": "7701234567",
                "contact_person": "Морозова Анна", "phone": "+7 (495) 123-45-67"},
            {"name": "ИП Иванов А.А.", "type": "individual", "inn": "770312345678",
                "contact_person": "Иванов Алексей", "phone": "+7 (916) 456-78-90"},
            {"name": "ООО «ТехноСтрой»", "type": "legal", "inn": "7712345678",
                "contact_person": "Сергеев Пётр", "phone": "+7 (495) 234-56-78"},
            {"name": "ООО «Продукты+»", "type": "legal", "inn": "7723456789",
                "contact_person": "Кузнецова Ольга", "phone": "+7 (495) 345-67-89"},
            {"name": "ИП Петров", "type": "individual", "inn": "770423456789",
                "contact_person": "Петров Сергей", "phone": "+7 (916) 567-89-01"},
            {"name": "ООО «СтройМир»", "type": "legal", "inn": "7734567890",
                "contact_person": "Смирнов Дмитрий", "phone": "+7 (495) 678-90-12"},
            {"name": "ООО «Логистика Плюс»", "type": "legal", "inn": "7745678901",
                "contact_person": "Волков Андрей", "phone": "+7 (495) 789-01-23"},
            {"name": "ИП Сидорова", "type": "individual", "inn": "770534567891",
                "contact_person": "Сидорова Мария", "phone": "+7 (916) 678-90-12"},
            {"name": "ООО «ТоргСнаб»", "type": "legal", "inn": "7756789012",
                "contact_person": "Козлов Илья", "phone": "+7 (495) 890-12-34"},
            {"name": "ООО «АгроТрейд»", "type": "legal", "inn": "7767890123",
                "contact_person": "Никитин Олег", "phone": "+7 (495) 901-23-45"},
            {"name": "ИП Кузнецов", "type": "individual", "inn": "770645678912",
                "contact_person": "Кузнецов Артём", "phone": "+7 (916) 789-01-23"},
            {"name": "ООО «МебельГрад»", "type": "legal", "inn": "7778901234",
                "contact_person": "Фёдорова Елена", "phone": "+7 (495) 012-34-56"},
        ]
        clients = [Client(**data) for data in clients_data]
        session.add_all(clients)

        # ==========================================
        # 2. МАРШРУТЫ
        # ==========================================
        routes_data = [
            {"from_address": "Москва", "to_address": "Тула", "distance_km": 185},
            {"from_address": "Москва", "to_address": "Калуга", "distance_km": 190},
            {"from_address": "Подольск", "to_address": "Рязань", "distance_km": 210},
            {"from_address": "Москва", "to_address": "Владимир", "distance_km": 185},
            {"from_address": "Химки", "to_address": "Тверь", "distance_km": 170},
            {"from_address": "Москва", "to_address": "Смоленск", "distance_km": 400},
            {"from_address": "Москва",
                "to_address": "Нижний Новгород", "distance_km": 420},
            {"from_address": "Москва", "to_address": "Ярославль", "distance_km": 270},
            {"from_address": "Тула", "to_address": "Орёл", "distance_km": 180},
            {"from_address": "Москва", "to_address": "Липецк", "distance_km": 450},
            {"from_address": "Калуга", "to_address": "Брянск", "distance_km": 220},
            {"from_address": "Москва", "to_address": "Иваново", "distance_km": 300},
        ]
        routes = [Route(**data) for data in routes_data]
        session.add_all(routes)

        # ==========================================
        # 3. ВОДИТЕЛИ
        # ==========================================
        drivers_data = [
            {"full_name": "Иванов Иван Иванович",
                "phone": "+7 (999) 123-45-67", "license_number": "77 АА 123456", "status": "available"},
            {"full_name": "Петров Пётр Петрович",
                "phone": "+7 (999) 234-56-78", "license_number": "50 ББ 234567", "status": "on_route"},
            {"full_name": "Сидоров Сергей Сергеевич",
                "phone": "+7 (999) 345-67-89", "license_number": "99 ВВ 345678", "status": "available"},
            {"full_name": "Кузнецов Алексей Дмитриевич",
                "phone": "+7 (999) 456-78-90", "license_number": "77 ГГ 456789", "status": "day_off"},
            {"full_name": "Смирнов Дмитрий Олегович",
                "phone": "+7 (999) 567-89-01", "license_number": "50 ДД 567890", "status": "fired"},
            {"full_name": "Волков Андрей Сергеевич",
                "phone": "+7 (999) 678-90-12", "license_number": "77 ЕЕ 678901", "status": "available"},
            {"full_name": "Козлов Илья Викторович",
                "phone": "+7 (999) 789-01-23", "license_number": "50 ЖЖ 789012", "status": "on_route"},
            {"full_name": "Никитин Олег Павлович",
                "phone": "+7 (999) 890-12-34", "license_number": "99 ЗЗ 890123", "status": "day_off"},
            {"full_name": "Фёдоров Артём Игоревич",
                "phone": "+7 (999) 901-23-45", "license_number": "77 ИИ 901234", "status": "available"},
            {"full_name": "Морозов Виктор Николаевич",
                "phone": "+7 (999) 012-34-56", "license_number": "50 КК 012345", "status": "available"},
            {"full_name": "Павлов Егор Александрович",
                "phone": "+7 (999) 111-22-33", "license_number": "99 ЛЛ 123456", "status": "on_route"},
            {"full_name": "Семёнов Максим Дмитриевич",
                "phone": "+7 (999) 222-33-44", "license_number": "77 ММ 234567", "status": "available"},
        ]
        drivers = [Driver(**data) for data in drivers_data]
        session.add_all(drivers)

        # ==========================================
        # 4. МАШИНЫ
        # ==========================================
        vehicles_data = [
            {"plate_number": "А123ВС 77", "brand": "ГАЗ", "model": "Газель Next",
                "vehicle_type": "gazelle", "capacity_kg": 1500, "status": "on_route"},
            {"plate_number": "В456МН 50", "brand": "КАМАЗ", "model": "5490",
                "vehicle_type": "truck", "capacity_kg": 20000, "status": "on_route"},
            {"plate_number": "Е789КХ 99", "brand": "Volvo", "model": "FH",
                "vehicle_type": "truck", "capacity_kg": 22000, "status": "available"},
            {"plate_number": "К321ОР 77", "brand": "MAN", "model": "TGL",
                "vehicle_type": "medium", "capacity_kg": 5000, "status": "available"},
            {"plate_number": "М654ТУ 50", "brand": "Ford", "model": "Transit",
                "vehicle_type": "gazelle", "capacity_kg": 1200, "status": "maintenance"},
            {"plate_number": "Р987СВ 99", "brand": "Scania", "model": "R450",
                "vehicle_type": "truck", "capacity_kg": 24000, "status": "available"},
            {"plate_number": "Т111АА 77", "brand": "ГАЗ", "model": "Газель Бизнес",
                "vehicle_type": "gazelle", "capacity_kg": 1500, "status": "available"},
            {"plate_number": "Х222ЕЕ 50", "brand": "Isuzu", "model": "ELF",
                "vehicle_type": "medium", "capacity_kg": 4000, "status": "available"},
            {"plate_number": "Ш333КК 99", "brand": "Mercedes-Benz", "model": "Actros",
                "vehicle_type": "truck", "capacity_kg": 20000, "status": "on_route"},
            {"plate_number": "У444ММ 77", "brand": "Peugeot", "model": "Boxer",
                "vehicle_type": "gazelle", "capacity_kg": 1500, "status": "available"},
            {"plate_number": "Я555НН 50", "brand": "DAF", "model": "XF",
                "vehicle_type": "truck", "capacity_kg": 25000, "status": "maintenance"},
            {"plate_number": "А666ОО 99", "brand": "Hyundai", "model": "HD78",
                "vehicle_type": "medium", "capacity_kg": 5000, "status": "available"},
        ]
        vehicles = [Vehicle(**data) for data in vehicles_data]
        session.add_all(vehicles)

        # ==========================================
        # 5. ТАРИФЫ
        # ==========================================
        pricing_data = [
            {"vehicle_type": "gazelle", "base_rate": 3000,
                "price_per_km": 25, "price_per_kg": 1},
            {"vehicle_type": "gazelle", "base_rate": 2500,
                "price_per_km": 22, "price_per_kg": 1},
            {"vehicle_type": "medium", "base_rate": 5000,
                "price_per_km": 35, "price_per_kg": 1.5},
            {"vehicle_type": "medium", "base_rate": 4500,
                "price_per_km": 30, "price_per_kg": 1.5},
            {"vehicle_type": "truck", "base_rate": 10000,
                "price_per_km": 50, "price_per_kg": 2},
            {"vehicle_type": "truck", "base_rate": 8500,
                "price_per_km": 45, "price_per_kg": 2},
            {"vehicle_type": "refrigerator", "base_rate": 12000,
                "price_per_km": 60, "price_per_kg": 3},
            {"vehicle_type": "refrigerator", "base_rate": 10500,
                "price_per_km": 55, "price_per_kg": 3},
            {"vehicle_type": "gazelle", "base_rate": 3500,
                "price_per_km": 28, "price_per_kg": 1.2},
            {"vehicle_type": "medium", "base_rate": 5500,
                "price_per_km": 38, "price_per_kg": 1.8},
            {"vehicle_type": "truck", "base_rate": 11000,
                "price_per_km": 52, "price_per_kg": 2.2},
            {"vehicle_type": "refrigerator", "base_rate": 13000,
                "price_per_km": 65, "price_per_kg": 3.5},
        ]
        pricings = [PricingRule(**data) for data in pricing_data]
        session.add_all(pricings)

        # ==========================================
        # СОХРАНЯЕМ ВСЁ, ЧТОБЫ ПОЛУЧИТЬ ID
        # ==========================================
        await session.commit()

        # ==========================================
        # 6. ЗАКАЗЫ
        # ==========================================
        # Словари для быстрого поиска ID по имени/номеру
        c_map = {c.name: c.id for c in clients}
        r_map = {f"{r.from_address} → {r.to_address}": r.id for r in routes}
        d_map = {d.full_name: d.id for d in drivers}
        v_map = {v.plate_number: v.id for v in vehicles}

        orders_data = [
            {"client_id": c_map["ООО «Ромашка»"], "route_id": r_map["Москва → Тула"], "driver_id": d_map["Иванов Иван Иванович"],
                "vehicle_id": v_map["А123ВС 77"], "cargo_name": "Стройматериалы", "weight_kg": 1500, "price": 18500, "status": "assigned"},
            {"client_id": c_map["ИП Иванов А.А."], "route_id": r_map["Москва → Калуга"], "driver_id": d_map["Петров Пётр Петрович"],
                "vehicle_id": v_map["В456МН 50"], "cargo_name": "Бытовая техника", "weight_kg": 5000, "price": 22000, "status": "in_progress"},
            {"client_id": c_map["ООО «ТехноСтрой»"], "route_id": r_map["Подольск → Рязань"], "driver_id": d_map["Сидоров Сергей Сергеевич"],
                "vehicle_id": v_map["Е789КХ 99"], "cargo_name": "Оборудование", "weight_kg": 8000, "price": 31700, "status": "delivered"},
            {"client_id": c_map["ООО «Продукты+»"], "route_id": r_map["Москва → Владимир"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Продукты питания", "weight_kg": 1200, "price": None, "status": "new"},
            {"client_id": c_map["ИП Петров"], "route_id": r_map["Химки → Тверь"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Мебель", "weight_kg": 3000, "price": None, "status": "cancelled"},
            {"client_id": c_map["ООО «СтройМир»"], "route_id": r_map["Москва → Смоленск"], "driver_id": d_map["Иванов Иван Иванович"],
                "vehicle_id": v_map["А123ВС 77"], "cargo_name": "Кирпич", "weight_kg": 10000, "price": 45200, "status": "completed"},
            {"client_id": c_map["ООО «Логистика Плюс»"], "route_id": r_map["Москва → Нижний Новгород"], "driver_id": d_map["Волков Андрей Сергеевич"],
                "vehicle_id": v_map["Р987СВ 99"], "cargo_name": "Электроника", "weight_kg": 2000, "price": 35000, "status": "assigned"},
            {"client_id": c_map["ИП Сидорова"], "route_id": r_map["Москва → Ярославль"], "driver_id": d_map["Козлов Илья Викторович"],
                "vehicle_id": v_map["Ш333КК 99"], "cargo_name": "Ткани", "weight_kg": 1500, "price": 28000, "status": "in_progress"},
            {"client_id": c_map["ООО «ТоргСнаб»"], "route_id": r_map["Тула → Орёл"], "driver_id": d_map["Фёдоров Артём Игоревич"],
                "vehicle_id": v_map["Х222ЕЕ 50"], "cargo_name": "Бумага", "weight_kg": 4000, "price": 19000, "status": "delivered"},
            {"client_id": c_map["ООО «АгроТрейд»"], "route_id": r_map["Москва → Липецк"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Удобрения", "weight_kg": 15000, "price": None, "status": "new"},
            {"client_id": c_map["ИП Кузнецов"], "route_id": r_map["Калуга → Брянск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Запчасти", "weight_kg": 800, "price": None, "status": "cancelled"},
            {"client_id": c_map["ООО «МебельГрад»"], "route_id": r_map["Москва → Иваново"], "driver_id": d_map["Морозов Виктор Николаевич"],
                "vehicle_id": v_map["Т111АА 77"], "cargo_name": "Шкафы", "weight_kg": 1400, "price": 24000, "status": "completed"},
        ]

        orders = [Order(**data) for data in orders_data]
        session.add_all(orders)

        # ==========================================
        # 7. ПОЛЬЗОВАТЕЛИ
        # ==========================================
        users_data = [
            {"email": "admin@crm.ru", "password_hash": "admin123",
                "full_name": "Соколов Игорь Петрович", "role": "admin"},
            {"email": "manager@crm.ru", "password_hash": "manager123",
                "full_name": "Морозова Анна Сергеевна", "role": "manager"},
            {"email": "driver@crm.ru", "password_hash": "driver123",
                "full_name": "Иванов Иван Иванович", "role": "driver"},
        ]
        users = [User(**data) for data in users_data]
        session.add_all(users)

        await session.commit()
        print("База успешно заполнена!")

if __name__ == "__main__":
    asyncio.run(seed_data())
