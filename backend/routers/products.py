from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from typing import List, Optional
from config.database import get_db
from models.user_model import Product
import schemas.products as product_schema
import services.product_service as product_service
from utils.dependencies import get_admin_user

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[product_schema.ProductResponse])
def get_products(
    category_id: Optional[int] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    in_stock: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    return product_service.get_products(db, category_id, min_price, max_price, in_stock)

@router.get("/{product_id}", response_model=product_schema.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@router.post("/upload-image", dependencies=[Depends(get_admin_user)])
def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    return {"url": f"http://localhost:8000/uploads/{file.filename}"}

@router.post("/create", response_model=product_schema.ProductResponse, dependencies=[Depends(get_admin_user)])
def create_product(product: product_schema.ProductCreate, db: Session = Depends(get_db)):
    return product_service.create(product, db)

@router.post("/update", response_model=product_schema.ProductResponse, dependencies=[Depends(get_admin_user)])
def update_product(product: product_schema.ProductUpdate, db: Session = Depends(get_db)):
    return product_service.update(product, db)

@router.post("/delete", dependencies=[Depends(get_admin_user)])
def delete_product(product: product_schema.ProductDelete, db: Session = Depends(get_db)):
    return product_service.delete(product, db)
