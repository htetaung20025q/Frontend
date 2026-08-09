from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from fastapi import HTTPException

class UserBase(BaseModel):
    username: str
    email: str
    is_admin: bool = False

class UserCreate(UserBase):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=30)
    password: str = Field(..., min_length=5, max_length=30)

class UserUpdate(UserBase):
    id: int
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=30)
    password: str = Field(None, min_length=5, max_length=30)

class UserDelete(BaseModel):
    id: int
    password: str = Field(None, min_length=5, max_length=30)

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True