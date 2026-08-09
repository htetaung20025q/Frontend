from sqlalchemy.orm import Session
from models.user_model import Order, Product
import schemas.order as order_schema
from fastapi import HTTPException, status
from models.user_model import OrderStatus

def create_order(order_data: order_schema.OrderCreate, user_id: int, db: Session):
    total_price = 0.0
    products = []
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not enough stock for product {product.name}")
        
        # Calculate price
        total_price += product.price * item.quantity
        # Decrease stock
        product.stock -= item.quantity
        products.append(product)
    
    new_order = Order(
        user_id=user_id,
        total_price=total_price,
        status=OrderStatus.pending
    )
    
    # We append the unique products to the order's secondary relationship
    for product in set(products):
        new_order.products.append(product)
        
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

def get_user_orders(user_id: int, db: Session):
    return db.query(Order).filter(Order.user_id == user_id).all()

def get_all_orders(db: Session):
    return db.query(Order).all()

def update_order_status(order_id: int, status_update: order_schema.OrderUpdate, db: Session):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Simple validation for Enum
    try:
        new_status = OrderStatus(status_update.status)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order
