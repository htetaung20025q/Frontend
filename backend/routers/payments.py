from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.database import get_db
import schemas.payment as payment_schema
import services.payment_service as payment_service
from utils.dependencies import get_current_user
from models.user_model import User

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/{order_id}", response_model=payment_schema.PaymentResponse)
def confirm_payment(order_id: int, payment: payment_schema.PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return payment_service.process_payment(order_id, payment, db)
