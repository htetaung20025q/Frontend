from sqlalchemy.orm import Session
from models.user_model import Payment, Order, PaymentStatus, OrderStatus
import schemas.payment as payment_schema
from fastapi import HTTPException, status
import uuid

def process_payment(order_id: int, payment_data: payment_schema.PaymentCreate, db: Session):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    if order.status != OrderStatus.pending:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order is not in pending status")
        
    if payment_data.amount < order.total_price:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment amount is less than total price")
        
    # Simulate processing with a mock transaction ID
    transaction_id = str(uuid.uuid4())
    
    new_payment = Payment(
        order_id=order_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        status=PaymentStatus.completed,
        transaction_id=transaction_id
    )
    
    order.status = OrderStatus.paid
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    db.refresh(order)
    
    return new_payment
