from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
import schemas.order as order_schema
import services.order_service as order_service
from utils.dependencies import get_current_user, get_admin_user
from models.user_model import User

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=order_schema.OrderResponse)
def place_order(order: order_schema.OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return order_service.create_order(order, current_user.id, db)

@router.get("/", response_model=List[order_schema.OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return order_service.get_user_orders(current_user.id, db)

@router.get("/all", response_model=List[order_schema.OrderResponse], dependencies=[Depends(get_admin_user)])
def get_all_orders(db: Session = Depends(get_db)):
    return order_service.get_all_orders(db)


@router.patch("/{order_id}/status", response_model=order_schema.OrderResponse, dependencies=[Depends(get_admin_user)])
def update_order_status(order_id: int, status_update: order_schema.OrderUpdate, db: Session = Depends(get_db)):
    return order_service.update_order_status(order_id, status_update, db)
