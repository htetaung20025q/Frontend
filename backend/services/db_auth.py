from sqlalchemy.orm import Session
from models.user_model import User
from schemas.user import UserCreate, UserUpdate, UserDelete
import services.jwt_ser as jwt_ser
from datetime import datetime, timedelta
from fastapi import HTTPException
from passlib.context import CryptContext

SECRET_KEY = "fiaief9093fjaiJIEIFiwIE29"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



def login(user: UserCreate, db: Session):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    elif not jwt_ser.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    else:
        access_token = jwt_ser.create_access_token(data={"id": db_user.id})
        return {"access_token": access_token, "user": {"id": db_user.id, "email": db_user.email, "username": db_user.username}}


def register(user: UserCreate, db: Session):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = jwt_ser.hash_password(user.password)
    db_user = User(
        email=user.email, username=user.username, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = jwt_ser.create_access_token(data={"id": db_user.id})
    return {"access_token": access_token, "user": {"id": db_user.id, "email": db_user.email, "username": db_user.username}}


def update(user: UserUpdate, db: Session):
    db_user = db.query(User).filter(User.id == user.id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    elif not jwt_ser.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    else:
        db_user.email = user.email
        db_user.username = user.username
        if user.password:
            db_user.hashed_password = jwt_ser.hash_password(user.password)
        db.commit()
        db.refresh(db_user)
        return {"user": {"id": db_user.id, "email": db_user.email, "username": db_user.username}}


def delete(user: UserDelete, db: Session):
    db_user = db.query(User).filter(User.id == user.id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    elif not jwt_ser.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    else:
        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}
