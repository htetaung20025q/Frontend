import os
from dotenv import load_dotenv
from passlib.context import CryptContext
load_dotenv()


class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7)) # 7 days
    DATABASE_URI = os.getenv("DATABASE_URI")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

settings = Settings()