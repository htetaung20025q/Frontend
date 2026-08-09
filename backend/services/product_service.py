from sqlalchemy.orm import Session
from models.user_model import Product
from schemas.products import ProductCreate, ProductUpdate, ProductDelete
from fastapi import HTTPException, status
from typing import Optional

def get_products(
    db: Session, 
    category_id: Optional[int] = None, 
    min_price: Optional[float] = None, 
    max_price: Optional[float] = None, 
    in_stock: Optional[bool] = None
):
    query = db.query(Product)
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if in_stock is not None:
        if in_stock:
            query = query.filter(Product.stock > 0)
        else:
            query = query.filter(Product.stock == 0)
    return query.all()

def create(product_data: ProductCreate, db: Session):
    if db.query(Product).filter(Product.name == product_data.name).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product already exists")

    new_product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        category_id=product_data.category_id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def update(product_data: ProductUpdate, db: Session):
    db_product = db.query(Product).filter(Product.id == product_data.id).first()

    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    else:
        db_product.name = product_data.name
        db_product.description = product_data.description
        db_product.price = product_data.price
        db_product.stock = product_data.stock
        db_product.category_id = product_data.category_id

        db.commit()
        db.refresh(db_product)
        return db_product


def delete(product_data: ProductDelete, db: Session):
    db_product = db.query(Product).filter(Product.id == product_data.id).first()

    if db_product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    else:
        db.delete(db_product)
        db.commit()
        return {"message": "Product deleted successfully"}
