from passlib.context import CryptContext

# Создаём контекст с использованием Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    """Хешируем пароль с помощью Argon2."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяем, совпадает ли введённый пароль с хешем."""
    return pwd_context.verify(plain_password, hashed_password)