from pydantic import BaseModel
from typing import List
from datetime import datetime

class OrderCreateItem(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderCreateItem]

class OrderUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_price: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
