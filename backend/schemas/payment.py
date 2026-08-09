from pydantic import BaseModel
from datetime import datetime

class PaymentCreate(BaseModel):
    amount: float
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: float
    payment_method: str
    status: str
    transaction_id: str
    created_at: datetime

    class Config:
        from_attributes = True
