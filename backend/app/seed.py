import asyncio
import sys
from sqlalchemy import select, text
from app.database import AsyncSessionLocal, engine, Base
from datetime import datetime, timedelta, timezone
from app.models.user import User
from app.models.client import Client
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.models.route import Route
from app.models.pricing import PricingRule
from app.models.order import Order
from app.security import hash_password


async def seed_data(reset: bool = False):
    async with AsyncSessionLocal() as session:
        if reset:
            await session.execute(text("""
                TRUNCATE TABLE
                    order_status_history,
                    orders,
                    drivers,
                    vehicles,
                    routes,
                    clients,
                    pricing_rules,
                    users
                RESTART IDENTITY CASCADE
            """))
            await session.commit()
            print("База очищена.")
        else:
            result = await session.execute(select(Driver))
            if result.scalars().first():
                print("Данные уже существуют. Пропускаем.")
                return

        print("Заполняем базу тестовыми данными...")

        # ==========================================
        # 1. КЛИЕНТЫ (36)
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
            {"name": "ООО «АвтоДеталь»", "type": "legal", "inn": "7789012345",
                "contact_person": "Орлов Виктор", "phone": "+7 (495) 111-22-33"},
            {"name": "ИП Соколова", "type": "individual", "inn": "770756789123",
                "contact_person": "Соколова Ирина", "phone": "+7 (916) 222-33-44"},
            {"name": "ООО «МеталлТорг»", "type": "legal", "inn": "7790123456",
                "contact_person": "Лебедев Максим", "phone": "+7 (495) 333-44-55"},
            {"name": "ООО «ХимПром»", "type": "legal", "inn": "7701234568",
                "contact_person": "Виноградова Татьяна", "phone": "+7 (495) 444-55-66"},
            {"name": "ИП Морозов", "type": "individual", "inn": "770867890234",
                "contact_person": "Морозов Денис", "phone": "+7 (916) 555-66-77"},
            {"name": "ООО «ЭнергоСбыт»", "type": "legal", "inn": "7702345679",
                "contact_person": "Павлов Роман", "phone": "+7 (495) 666-77-88"},
            {"name": "ООО «ПродМаркет»", "type": "legal", "inn": "7703456780",
                "contact_person": "Зайцева Наталья", "phone": "+7 (495) 777-88-99"},
            {"name": "ИП Волкова", "type": "individual", "inn": "770978901345",
                "contact_person": "Волкова Ольга", "phone": "+7 (916) 888-99-00"},
            {"name": "ООО «СпецТехника»", "type": "legal", "inn": "7704567891",
                "contact_person": "Комаров Игорь", "phone": "+7 (495) 999-00-11"},
            {"name": "ООО «ГрузАвто»", "type": "legal", "inn": "7705678902",
                "contact_person": "Мельников Павел", "phone": "+7 (495) 000-11-22"},
            {"name": "ИП Фёдоров", "type": "individual", "inn": "770189012456",
                "contact_person": "Фёдоров Антон", "phone": "+7 (916) 121-31-41"},
            {"name": "ООО «СнабКомплект»", "type": "legal", "inn": "7706789013",
                "contact_person": "Гусева Светлана", "phone": "+7 (495) 232-42-52"},
            {"name": "ООО «ТрансЛогистик»", "type": "legal", "inn": "7707890124",
                "contact_person": "Белов Артур", "phone": "+7 (495) 343-53-63"},
            {"name": "ИП Белова", "type": "individual", "inn": "770290123567",
                "contact_person": "Белова Ксения", "phone": "+7 (916) 454-64-74"},
            {"name": "ООО «ПромСнаб»", "type": "legal", "inn": "7708901235",
                "contact_person": "Титов Владислав", "phone": "+7 (495) 565-75-85"},
            {"name": "ООО «ТоргОборудование»", "type": "legal", "inn": "7709012346",
                "contact_person": "Егорова Полина", "phone": "+7 (495) 676-86-96"},
            {"name": "ИП Тихонов", "type": "individual", "inn": "770301234678",
                "contact_person": "Тихонов Борис", "phone": "+7 (916) 787-97-07"},
            {"name": "ООО «СтройБаза»", "type": "legal", "inn": "7700123457",
                "contact_person": "Миронов Глеб", "phone": "+7 (495) 898-08-18"},
            {"name": "ООО «АгроХолдинг»", "type": "legal", "inn": "7701234569",
                "contact_person": "Соловьёва Вера", "phone": "+7 (495) 909-19-29"},
            {"name": "ИП Романов", "type": "individual", "inn": "770412345789",
                "contact_person": "Романов Илья", "phone": "+7 (916) 010-20-30"},
            {"name": "ООО «Промышленник»", "type": "legal", "inn": "7702345680",
                "contact_person": "Крылов Станислав", "phone": "+7 (495) 121-31-41"},
            {"name": "ООО «ТрансСервис»", "type": "legal", "inn": "7703456791",
                "contact_person": "Антонова Лилия", "phone": "+7 (495) 232-42-52"},
            {"name": "ИП Захаров", "type": "individual", "inn": "770523456890",
                "contact_person": "Захаров Егор", "phone": "+7 (916) 343-53-63"},
            {"name": "ООО «МегаТорг»", "type": "legal", "inn": "7704567802",
                "contact_person": "Данилова Алина", "phone": "+7 (495) 454-64-74"},
        ]
        clients = [Client(**data) for data in clients_data]
        session.add_all(clients)

        # ==========================================
        # 2. МАРШРУТЫ (36)
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
            {"from_address": "Москва", "to_address": "Воронеж", "distance_km": 520},
            {"from_address": "Москва", "to_address": "Курск", "distance_km": 530},
            {"from_address": "Москва", "to_address": "Тамбов", "distance_km": 460},
            {"from_address": "Москва", "to_address": "Рязань", "distance_km": 200},
            {"from_address": "Москва", "to_address": "Тверь", "distance_km": 180},
            {"from_address": "Москва", "to_address": "Кострома", "distance_km": 340},
            {"from_address": "Москва", "to_address": "Смоленск", "distance_km": 400},
            {"from_address": "Санкт-Петербург",
                "to_address": "Псков", "distance_km": 290},
            {"from_address": "Санкт-Петербург",
                "to_address": "Новгород", "distance_km": 190},
            {"from_address": "Санкт-Петербург",
                "to_address": "Тихвин", "distance_km": 240},
            {"from_address": "Казань", "to_address": "Ульяновск", "distance_km": 240},
            {"from_address": "Казань", "to_address": "Самара", "distance_km": 460},
            {"from_address": "Екатеринбург",
                "to_address": "Челябинск", "distance_km": 210},
            {"from_address": "Екатеринбург",
                "to_address": "Тюмень", "distance_km": 320},
            {"from_address": "Новосибирск",
                "to_address": "Барнаул", "distance_km": 230},
            {"from_address": "Новосибирск", "to_address": "Омск", "distance_km": 650},
            {"from_address": "Ростов-на-Дону",
                "to_address": "Краснодар", "distance_km": 270},
            {"from_address": "Ростов-на-Дону",
                "to_address": "Волгоград", "distance_km": 480},
            {"from_address": "Воронеж", "to_address": "Белгород", "distance_km": 290},
            {"from_address": "Краснодар", "to_address": "Сочи", "distance_km": 300},
            {"from_address": "Уфа", "to_address": "Оренбург", "distance_km": 370},
            {"from_address": "Пермь", "to_address": "Ижевск", "distance_km": 280},
            {"from_address": "Саратов", "to_address": "Пенза", "distance_km": 230},
            {"from_address": "Ярославль", "to_address": "Вологда", "distance_km": 200},
        ]
        routes = [Route(**data) for data in routes_data]
        session.add_all(routes)

        # ==========================================
        # 3. ПОЛЬЗОВАТЕЛИ (36)
        # ==========================================
        users_data = [
            {"email": "admin@crm.ru", "password_hash": hash_password(
                "admin123"), "full_name": "Качуков Александр Викторович", "role": "admin", "is_active": True},
            {"email": "manager@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Морозова Анна Сергеевна", "role": "manager", "is_active": True},
            {"email": "driver@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Иванов Иван Иванович", "role": "driver", "is_active": True},
            {"email": "e.smirnova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Смирнова Елена Викторовна", "role": "manager", "is_active": True},
            {"email": "a.kuznetsov@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Кузнецов Алексей Дмитриевич", "role": "manager", "is_active": True},
            {"email": "d.smirnov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Смирнов Дмитрий Олегович", "role": "driver", "is_active": False},
            {"email": "s.sidorov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Сидоров Сергей Сергеевич", "role": "driver", "is_active": True},
            {"email": "a.volkov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Волков Андрей Сергеевич", "role": "driver", "is_active": True},
            {"email": "i.kozlov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Козлов Илья Викторович", "role": "driver", "is_active": False},
            {"email": "o.nikitin@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Никитин Олег Павлович", "role": "driver", "is_active": False},
            {"email": "e.pavlov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Павлов Егор Александрович", "role": "driver", "is_active": True},
            {"email": "m.semenov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Семёнов Максим Дмитриевич", "role": "driver", "is_active": True},
            {"email": "v.orlov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Орлов Виктор Андреевич", "role": "driver", "is_active": True},
            {"email": "i.sokolova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Соколова Ирина Павловна", "role": "manager", "is_active": True},
            {"email": "m.lebedev@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Лебедев Максим Игоревич", "role": "driver", "is_active": True},
            {"email": "t.vinogradova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Виноградова Татьяна Сергеевна", "role": "manager", "is_active": True},
            {"email": "d.morozov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Морозов Денис Александрович", "role": "driver", "is_active": False},
            {"email": "r.pavlov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Павлов Роман Дмитриевич", "role": "driver", "is_active": True},
            {"email": "n.zaytseva@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Зайцева Наталья Викторовна", "role": "manager", "is_active": True},
            {"email": "o.volkova@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Волкова Ольга Ивановна", "role": "driver", "is_active": True},
            {"email": "i.komarov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Комаров Игорь Петрович", "role": "driver", "is_active": True},
            {"email": "p.melnikov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Мельников Павел Сергеевич", "role": "driver", "is_active": True},
            {"email": "a.fedorov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Фёдоров Антон Игоревич", "role": "driver", "is_active": True},
            {"email": "s.guseva@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Гусева Светлана Олеговна", "role": "manager", "is_active": True},
            {"email": "a.belov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Белов Артур Викторович", "role": "driver", "is_active": True},
            {"email": "k.belova@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Белова Ксения Андреевна", "role": "driver", "is_active": True},
            {"email": "v.titov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Титов Владислав Дмитриевич", "role": "driver", "is_active": False},
            {"email": "p.egorova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Егорова Полина Сергеевна", "role": "manager", "is_active": True},
            {"email": "b.tikhonov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Тихонов Борис Павлович", "role": "driver", "is_active": True},
            {"email": "g.mironov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Миронов Глеб Андреевич", "role": "driver", "is_active": True},
            {"email": "v.soloveva@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Соловьёва Вера Ивановна", "role": "manager", "is_active": True},
            {"email": "i.romanov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Романов Илья Сергеевич", "role": "driver", "is_active": True},
            {"email": "s.krylov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Крылов Станислав Викторович", "role": "driver", "is_active": False},
            {"email": "l.antonova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Антонова Лилия Павловна", "role": "manager", "is_active": True},
            {"email": "e.zakharov@crm.ru", "password_hash": hash_password(
                "driver123"), "full_name": "Захаров Егор Андреевич", "role": "driver", "is_active": True},
            {"email": "a.danilova@crm.ru", "password_hash": hash_password(
                "manager123"), "full_name": "Данилова Алина Сергеевна", "role": "manager", "is_active": True},
        ]
        users = [User(**data) for data in users_data]
        session.add_all(users)
        await session.commit()  # коммит, чтобы получить ID

        # ==========================================
        # 4. ВОДИТЕЛИ (36)
        # ==========================================
        drivers_data = [
            {"full_name": "Иванов Иван Иванович",
                "phone": "+7 (999) 123-45-67", "license_number": "77 АА 123456", "status": "available", "user_id": 3},
            {"full_name": "Петров Пётр Петрович",
                "phone": "+7 (999) 234-56-78", "license_number": "50 ББ 234567", "status": "on_route"},
            {"full_name": "Сидоров Сергей Сергеевич",
                "phone": "+7 (999) 345-67-89", "license_number": "99 ВВ 345678", "status": "available", "user_id": 7},
            {"full_name": "Кузнецов Алексей Дмитриевич",
                "phone": "+7 (999) 456-78-90", "license_number": "77 ГГ 456789", "status": "day_off"},
            {"full_name": "Смирнов Дмитрий Олегович",
                "phone": "+7 (999) 567-89-01", "license_number": "50 ДД 567890", "status": "fired", "user_id": 6},
            {"full_name": "Волков Андрей Сергеевич",
                "phone": "+7 (999) 678-90-12", "license_number": "77 ЕЕ 678901", "status": "available", "user_id": 8},
            {"full_name": "Козлов Илья Викторович",
                "phone": "+7 (999) 789-01-23", "license_number": "50 ЖЖ 789012", "status": "on_route", "user_id": 9},
            {"full_name": "Никитин Олег Павлович",
                "phone": "+7 (999) 890-12-34", "license_number": "99 ЗЗ 890123", "status": "day_off", "user_id": 10},
            {"full_name": "Фёдоров Артём Игоревич",
                "phone": "+7 (999) 901-23-45", "license_number": "77 ИИ 901234", "status": "available"},
            {"full_name": "Морозов Виктор Николаевич",
                "phone": "+7 (999) 012-34-56", "license_number": "50 КК 012345", "status": "available"},
            {"full_name": "Павлов Егор Александрович",
                "phone": "+7 (999) 111-22-33", "license_number": "99 ЛЛ 123456", "status": "on_route", "user_id": 11},
            {"full_name": "Семёнов Максим Дмитриевич",
                "phone": "+7 (999) 222-33-44", "license_number": "77 ММ 234567", "status": "available", "user_id": 12},
            {"full_name": "Орлов Виктор Андреевич",
                "phone": "+7 (999) 333-44-55", "license_number": "50 НН 345678", "status": "available", "user_id": 13},
            {"full_name": "Лебедев Максим Игоревич",
                "phone": "+7 (999) 444-55-66", "license_number": "77 ОО 456789", "status": "on_route", "user_id": 15},
            {"full_name": "Морозов Денис Александрович",
                "phone": "+7 (999) 555-66-77", "license_number": "99 ПП 567890", "status": "fired", "user_id": 17},
            {"full_name": "Павлов Роман Дмитриевич",
                "phone": "+7 (999) 666-77-88", "license_number": "50 РР 678901", "status": "available", "user_id": 18},
            {"full_name": "Волкова Ольга Ивановна",
                "phone": "+7 (999) 777-88-99", "license_number": "77 СС 789012", "status": "available", "user_id": 20},
            {"full_name": "Комаров Игорь Петрович",
                "phone": "+7 (999) 888-99-00", "license_number": "99 ТТ 890123", "status": "on_route", "user_id": 21},
            {"full_name": "Мельников Павел Сергеевич",
                "phone": "+7 (999) 999-00-11", "license_number": "50 УУ 901234", "status": "day_off", "user_id": 22},
            {"full_name": "Фёдоров Антон Игоревич",
                "phone": "+7 (999) 000-11-22", "license_number": "77 ФФ 012345", "status": "available", "user_id": 23},
            {"full_name": "Белов Артур Викторович",
                "phone": "+7 (999) 121-31-41", "license_number": "99 ХХ 123456", "status": "available", "user_id": 25},
            {"full_name": "Белова Ксения Андреевна",
                "phone": "+7 (999) 232-42-52", "license_number": "50 ЦЦ 234567", "status": "on_route", "user_id": 26},
            {"full_name": "Титов Владислав Дмитриевич",
                "phone": "+7 (999) 343-53-63", "license_number": "77 ЧЧ 345678", "status": "fired", "user_id": 27},
            {"full_name": "Тихонов Борис Павлович",
                "phone": "+7 (999) 454-64-74", "license_number": "99 ШШ 456789", "status": "available", "user_id": 29},
            {"full_name": "Миронов Глеб Андреевич",
                "phone": "+7 (999) 565-75-85", "license_number": "50 ЩЩ 567890", "status": "day_off", "user_id": 30},
            {"full_name": "Романов Илья Сергеевич",
                "phone": "+7 (999) 676-86-96", "license_number": "77 ЭЭ 678901", "status": "available", "user_id": 32},
            {"full_name": "Крылов Станислав Викторович",
                "phone": "+7 (999) 787-97-07", "license_number": "99 ЮЮ 789012", "status": "fired", "user_id": 33},
            {"full_name": "Захаров Егор Андреевич",
                "phone": "+7 (999) 898-08-18", "license_number": "50 ЯЯ 890123", "status": "available", "user_id": 35},
            {"full_name": "Гусев Андрей Павлович",
                "phone": "+7 (999) 909-19-29", "license_number": "77 АБ 901234", "status": "available"},
            {"full_name": "Данилов Сергей Игоревич",
                "phone": "+7 (999) 010-20-30", "license_number": "50 ВГ 012345", "status": "on_route"},
            {"full_name": "Егоров Павел Викторович",
                "phone": "+7 (999) 121-31-41", "license_number": "99 ДЕ 123456", "status": "available"},
            {"full_name": "Жуков Андрей Сергеевич",
                "phone": "+7 (999) 232-42-52", "license_number": "77 ЁЖ 234567", "status": "day_off"},
            {"full_name": "Зимин Олег Николаевич",
                "phone": "+7 (999) 343-53-63", "license_number": "50 ЗИ 345678", "status": "available"},
            {"full_name": "Ильин Максим Дмитриевич",
                "phone": "+7 (999) 454-64-74", "license_number": "99 ЙК 456789", "status": "on_route"},
            {"full_name": "Киселёв Игорь Андреевич",
                "phone": "+7 (999) 565-75-85", "license_number": "77 ЛМ 567890", "status": "available"},
            {"full_name": "Ларин Денис Павлович",
                "phone": "+7 (999) 676-86-96", "license_number": "50 НО 678901", "status": "available"},
        ]
        drivers = [Driver(**data) for data in drivers_data]
        session.add_all(drivers)

        # ==========================================
        # 5. МАШИНЫ (36)
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
            {"plate_number": "Б777РР 77", "brand": "ГАЗ", "model": "Газель Next",
                "vehicle_type": "gazelle", "capacity_kg": 1500, "status": "available"},
            {"plate_number": "В888СС 50", "brand": "Renault", "model": "Master",
                "vehicle_type": "gazelle", "capacity_kg": 1400, "status": "on_route"},
            {"plate_number": "Г999ТТ 99", "brand": "MAN", "model": "TGS",
                "vehicle_type": "truck", "capacity_kg": 21000, "status": "available"},
            {"plate_number": "Д100УУ 77", "brand": "Mercedes-Benz", "model": "Sprinter",
                "vehicle_type": "gazelle", "capacity_kg": 1300, "status": "available"},
            {"plate_number": "Е200ФФ 50", "brand": "Volvo", "model": "FM",
                "vehicle_type": "truck", "capacity_kg": 23000, "status": "maintenance"},
            {"plate_number": "Ж300ХХ 99", "brand": "Isuzu", "model": "NPR",
                "vehicle_type": "medium", "capacity_kg": 4500, "status": "available"},
            {"plate_number": "З400ЦЦ 77", "brand": "Scania", "model": "P380",
                "vehicle_type": "truck", "capacity_kg": 22000, "status": "on_route"},
            {"plate_number": "И500ЧЧ 50", "brand": "Volkswagen", "model": "Crafter",
                "vehicle_type": "gazelle", "capacity_kg": 1400, "status": "available"},
            {"plate_number": "К600ШШ 99", "brand": "DAF", "model": "CF",
                "vehicle_type": "truck", "capacity_kg": 19000, "status": "available"},
            {"plate_number": "Л700ЩЩ 77", "brand": "Toyota", "model": "Dyna",
                "vehicle_type": "medium", "capacity_kg": 3500, "status": "available"},
            {"plate_number": "М800ЭЭ 50", "brand": "ГАЗ", "model": "Газон Next",
                "vehicle_type": "medium", "capacity_kg": 6000, "status": "on_route"},
            {"plate_number": "Н900ЮЮ 99", "brand": "MAN", "model": "TGX",
                "vehicle_type": "truck", "capacity_kg": 24000, "status": "available"},
            {"plate_number": "О010ЯЯ 77", "brand": "Ford", "model": "Transit",
                "vehicle_type": "gazelle", "capacity_kg": 1500, "status": "maintenance"},
            {"plate_number": "П020АБ 50", "brand": "Mercedes-Benz", "model": "Atego",
                "vehicle_type": "medium", "capacity_kg": 5000, "status": "available"},
            {"plate_number": "Р030ВГ 99", "brand": "Scania", "model": "S500",
                "vehicle_type": "truck", "capacity_kg": 25000, "status": "available"},
            {"plate_number": "С040ДЕ 77", "brand": "Peugeot", "model": "Boxer",
                "vehicle_type": "gazelle", "capacity_kg": 1400, "status": "on_route"},
            {"plate_number": "Т050ЁЖ 50", "brand": "Hyundai", "model": "Mighty",
                "vehicle_type": "medium", "capacity_kg": 4200, "status": "available"},
            {"plate_number": "У060ЗИ 99", "brand": "Volvo", "model": "FH16",
                "vehicle_type": "truck", "capacity_kg": 26000, "status": "available"},
            {"plate_number": "Ф070ЙК 77", "brand": "ГАЗ", "model": "Соболь",
                "vehicle_type": "gazelle", "capacity_kg": 1000, "status": "maintenance"},
            {"plate_number": "Х080ЛМ 50", "brand": "Isuzu", "model": "Forward",
                "vehicle_type": "medium", "capacity_kg": 5500, "status": "available"},
            {"plate_number": "Ц090НО 99", "brand": "КАМАЗ", "model": "65115",
                "vehicle_type": "truck", "capacity_kg": 20000, "status": "on_route"},
            {"plate_number": "Ч100ПР 77", "brand": "Citroen", "model": "Jumper",
                "vehicle_type": "gazelle", "capacity_kg": 1400, "status": "available"},
            {"plate_number": "Ш110СТ 50", "brand": "MAN", "model": "TGM",
                "vehicle_type": "medium", "capacity_kg": 5800, "status": "available"},
            {"plate_number": "Щ120УФ 99", "brand": "Renault", "model": "Premium",
                "vehicle_type": "truck", "capacity_kg": 21000, "status": "available"},
        ]
        vehicles = [Vehicle(**data) for data in vehicles_data]
        session.add_all(vehicles)

        # ==========================================
        # 6. ТАРИФЫ (36)
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
            {"vehicle_type": "gazelle", "base_rate": 2800,
                "price_per_km": 24, "price_per_kg": 0.9},
            {"vehicle_type": "gazelle", "base_rate": 3200,
                "price_per_km": 26, "price_per_kg": 1.1},
            {"vehicle_type": "medium", "base_rate": 4800,
                "price_per_km": 32, "price_per_kg": 1.4},
            {"vehicle_type": "medium", "base_rate": 5200,
                "price_per_km": 36, "price_per_kg": 1.7},
            {"vehicle_type": "truck", "base_rate": 9500,
                "price_per_km": 48, "price_per_kg": 1.9},
            {"vehicle_type": "truck", "base_rate": 10500,
                "price_per_km": 51, "price_per_kg": 2.1},
            {"vehicle_type": "refrigerator", "base_rate": 11500,
                "price_per_km": 58, "price_per_kg": 2.8},
            {"vehicle_type": "refrigerator", "base_rate": 12500,
                "price_per_km": 62, "price_per_kg": 3.2},
            {"vehicle_type": "gazelle", "base_rate": 3100,
                "price_per_km": 27, "price_per_kg": 1.0},
            {"vehicle_type": "gazelle", "base_rate": 2700,
                "price_per_km": 23, "price_per_kg": 0.8},
            {"vehicle_type": "medium", "base_rate": 5100,
                "price_per_km": 34, "price_per_kg": 1.6},
            {"vehicle_type": "medium", "base_rate": 5300,
                "price_per_km": 37, "price_per_kg": 1.9},
            {"vehicle_type": "truck", "base_rate": 10200,
                "price_per_km": 49, "price_per_kg": 2.0},
            {"vehicle_type": "truck", "base_rate": 8800,
                "price_per_km": 46, "price_per_kg": 1.8},
            {"vehicle_type": "refrigerator", "base_rate": 12200,
                "price_per_km": 61, "price_per_kg": 3.1},
            {"vehicle_type": "refrigerator", "base_rate": 11000,
                "price_per_km": 56, "price_per_kg": 2.9},
            {"vehicle_type": "gazelle", "base_rate": 3300,
                "price_per_km": 29, "price_per_kg": 1.3},
            {"vehicle_type": "gazelle", "base_rate": 2600,
                "price_per_km": 21, "price_per_kg": 0.7},
            {"vehicle_type": "medium", "base_rate": 4900,
                "price_per_km": 31, "price_per_kg": 1.5},
            {"vehicle_type": "medium", "base_rate": 5400,
                "price_per_km": 39, "price_per_kg": 1.8},
            {"vehicle_type": "truck", "base_rate": 9800,
                "price_per_km": 47, "price_per_kg": 1.9},
            {"vehicle_type": "truck", "base_rate": 10800,
                "price_per_km": 53, "price_per_kg": 2.3},
            {"vehicle_type": "refrigerator", "base_rate": 12800,
                "price_per_km": 63, "price_per_kg": 3.3},
            {"vehicle_type": "refrigerator", "base_rate": 11800,
                "price_per_km": 59, "price_per_kg": 3.0},
        ]
        pricings = [PricingRule(**data) for data in pricing_data]
        session.add_all(pricings)

        # Сохраняем всё, чтобы получить ID
        await session.commit()

        # ==========================================
        # 7. ЗАКАЗЫ (36)
        # ==========================================

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
            {"client_id": c_map["ООО «АвтоДеталь»"], "route_id": r_map["Москва → Воронеж"], "driver_id": d_map["Орлов Виктор Андреевич"],
                "vehicle_id": v_map["Б777РР 77"], "cargo_name": "Автозапчасти", "weight_kg": 1200, "price": 32000, "status": "assigned"},
            {"client_id": c_map["ИП Соколова"], "route_id": r_map["Москва → Курск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Одежда", "weight_kg": 600, "price": None, "status": "new"},
            {"client_id": c_map["ООО «МеталлТорг»"], "route_id": r_map["Москва → Тамбов"], "driver_id": d_map["Лебедев Максим Игоревич"],
                "vehicle_id": v_map["В888СС 50"], "cargo_name": "Металлопрокат", "weight_kg": 18000, "price": 51000, "status": "in_progress"},
            {"client_id": c_map["ООО «ХимПром»"], "route_id": r_map["Москва → Рязань"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Химикаты", "weight_kg": 7000, "price": None, "status": "cancelled"},
            {"client_id": c_map["ИП Морозов"], "route_id": r_map["Москва → Тверь"], "driver_id": d_map["Павлов Роман Дмитриевич"],
                "vehicle_id": v_map["Г999ТТ 99"], "cargo_name": "Стройматериалы", "weight_kg": 16000, "price": 41000, "status": "completed"},
            {"client_id": c_map["ООО «ЭнергоСбыт»"], "route_id": r_map["Москва → Кострома"], "driver_id": d_map["Волкова Ольга Ивановна"],
                "vehicle_id": v_map["Д100УУ 77"], "cargo_name": "Кабель", "weight_kg": 2000, "price": 29000, "status": "delivered"},
            {"client_id": c_map["ООО «ПродМаркет»"], "route_id": r_map["Москва → Смоленск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Продукты", "weight_kg": 3000, "price": None, "status": "new"},
            {"client_id": c_map["ИП Волкова"], "route_id": r_map["Санкт-Петербург → Псков"], "driver_id": d_map["Комаров Игорь Петрович"],
                "vehicle_id": v_map["Е200ФФ 50"], "cargo_name": "Мебель", "weight_kg": 5000, "price": 38000, "status": "assigned"},
            {"client_id": c_map["ООО «СпецТехника»"], "route_id": r_map["Санкт-Петербург → Новгород"], "driver_id": d_map["Мельников Павел Сергеевич"],
                "vehicle_id": v_map["Ж300ХХ 99"], "cargo_name": "Спецтехника", "weight_kg": 4500, "price": 27000, "status": "in_progress"},
            {"client_id": c_map["ООО «ГрузАвто»"], "route_id": r_map["Санкт-Петербург → Тихвин"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Автозапчасти", "weight_kg": 3500, "price": None, "status": "cancelled"},
            {"client_id": c_map["ИП Фёдоров"], "route_id": r_map["Казань → Ульяновск"], "driver_id": d_map["Фёдоров Антон Игоревич"],
                "vehicle_id": v_map["З400ЦЦ 77"], "cargo_name": "Бытовая техника", "weight_kg": 2000, "price": 25000, "status": "completed"},
            {"client_id": c_map["ООО «СнабКомплект»"], "route_id": r_map["Казань → Самара"], "driver_id": d_map["Белов Артур Викторович"],
                "vehicle_id": v_map["И500ЧЧ 50"], "cargo_name": "Комплектующие", "weight_kg": 1400, "price": 36000, "status": "delivered"},
            {"client_id": c_map["ООО «ТрансЛогистик»"], "route_id": r_map["Екатеринбург → Челябинск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Металл", "weight_kg": 19000, "price": None, "status": "new"},
            {"client_id": c_map["ИП Белова"], "route_id": r_map["Екатеринбург → Тюмень"], "driver_id": d_map["Белова Ксения Андреевна"],
                "vehicle_id": v_map["К600ШШ 99"], "cargo_name": "Товары народного потребления", "weight_kg": 3000, "price": 30000, "status": "assigned"},
            {"client_id": c_map["ООО «ПромСнаб»"], "route_id": r_map["Новосибирск → Барнаул"], "driver_id": d_map["Тихонов Борис Павлович"],
                "vehicle_id": v_map["Л700ЩЩ 77"], "cargo_name": "Стройматериалы", "weight_kg": 6000, "price": 34000, "status": "in_progress"},
            {"client_id": c_map["ООО «ТоргОборудование»"], "route_id": r_map["Новосибирск → Омск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Торговое оборудование", "weight_kg": 5500, "price": None, "status": "cancelled"},
            {"client_id": c_map["ИП Тихонов"], "route_id": r_map["Ростов-на-Дону → Краснодар"], "driver_id": d_map["Романов Илья Сергеевич"],
                "vehicle_id": v_map["М800ЭЭ 50"], "cargo_name": "Продукты", "weight_kg": 4000, "price": 31000, "status": "completed"},
            {"client_id": c_map["ООО «СтройБаза»"], "route_id": r_map["Ростов-на-Дону → Волгоград"], "driver_id": d_map["Захаров Егор Андреевич"],
                "vehicle_id": v_map["Н900ЮЮ 99"], "cargo_name": "Кирпич", "weight_kg": 20000, "price": 48000, "status": "delivered"},
            {"client_id": c_map["ООО «АгроХолдинг»"], "route_id": r_map["Воронеж → Белгород"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Зерно", "weight_kg": 12000, "price": None, "status": "new"},
            {"client_id": c_map["ИП Романов"], "route_id": r_map["Краснодар → Сочи"], "driver_id": d_map["Гусев Андрей Павлович"],
                "vehicle_id": v_map["О010ЯЯ 77"], "cargo_name": "Мебель", "weight_kg": 2500, "price": 22000, "status": "assigned"},
            {"client_id": c_map["ООО «Промышленник»"], "route_id": r_map["Уфа → Оренбург"], "driver_id": d_map["Данилов Сергей Игоревич"],
                "vehicle_id": v_map["П020АБ 50"], "cargo_name": "Нефтепродукты", "weight_kg": 5000, "price": 37000, "status": "in_progress"},
            {"client_id": c_map["ООО «ТрансСервис»"], "route_id": r_map["Пермь → Ижевск"], "driver_id": None,
                "vehicle_id": None, "cargo_name": "Запчасти", "weight_kg": 3500, "price": None, "status": "cancelled"},
            {"client_id": c_map["ИП Захаров"], "route_id": r_map["Саратов → Пенза"], "driver_id": d_map["Егоров Павел Викторович"],
                "vehicle_id": v_map["Р030ВГ 99"], "cargo_name": "Бумага", "weight_kg": 3000, "price": 26000, "status": "completed"},
            {"client_id": c_map["ООО «МегаТорг»"], "route_id": r_map["Ярославль → Вологда"], "driver_id": d_map["Киселёв Игорь Андреевич"],
                "vehicle_id": v_map["С040ДЕ 77"], "cargo_name": "Товары для дома", "weight_kg": 1200, "price": 19000, "status": "delivered"},
        ]

        now = datetime.now(timezone.utc).replace(tzinfo=None)

        for index, order in enumerate(orders_data):
            created_at = now - timedelta(
                days=(len(orders_data) - index) % 45,
                hours=index % 8,
            )
            order["created_at"] = created_at
            order["updated_at"] = created_at

        orders = [Order(**data) for data in orders_data]
        session.add_all(orders)

        await session.commit()
        print("База успешно заполнена!")


if __name__ == "__main__":
    asyncio.run(seed_data(reset="--reset" in sys.argv))
