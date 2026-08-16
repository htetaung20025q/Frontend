from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config.database import engine, Base

# Import Routers
from routers import auth, products, orders, payments

Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-commerce API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "https://your-frontend-project.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://backend-final-3ouo.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"message": "Welcome to the E-commerce API"}


# Include modular routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
