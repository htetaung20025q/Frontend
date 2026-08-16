from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.database import get_db
import schemas.user as user_schema
import schemas.token as token_schema
from models.user_model import User
import services.jwt_ser as jwt_ser
from utils.dependencies import get_current_user, oauth2_scheme

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=token_schema.Token)
def register(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    
    hashed_password = jwt_ser.hash_password(user.password)
    db_user = User(
        email=user.email, username=user.username, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = jwt_ser.create_access_token(data={"id": db_user.id})
    refresh_token = jwt_ser.create_refresh_token(data={"id": db_user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/login", response_model=token_schema.Token)
def login(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    # Note: user_schema.UserCreate is used for login payload, ideally it should be a separate Login schema
    # But sticking to existing schema structure for simplicity.
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    elif not jwt_ser.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    
    access_token = jwt_ser.create_access_token(data={"id": db_user.id})
    refresh_token = jwt_ser.create_refresh_token(data={"id": db_user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=token_schema.Token)
def refresh(refresh_token: str, db: Session = Depends(get_db)):
    if jwt_ser.is_token_blacklisted(refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has been revoked")
    
    payload = jwt_ser.decode_token(refresh_token)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    access_token = jwt_ser.create_access_token(data={"id": user_id})
    new_refresh_token = jwt_ser.create_refresh_token(data={"id": user_id})
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.get("/me", response_model=user_schema.UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    jwt_ser.blacklist_token(token)
    return {"message": "Successfully logged out"}

@router.get("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        hashed_password = jwt_ser.hash_password("admin123")
        new_admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        return {"message": "Admin user (admin@example.com) successfully seeded! You can now log in."}
    return {"message": "Admin already exists in this database."}


