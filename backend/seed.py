import sys
import os

# Ensure the script can import from the backend module when run from inside backend folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal, Base, engine
from models.user_model import User
from services.jwt_ser import hash_password

def seed_admin():
    db = SessionLocal()
    
    # Ensure tables exist (if not already created)
    Base.metadata.create_all(bind=engine)
    
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        new_admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("admin123"),
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        print("Admin user seeded successfully!")
    else:
        print("Admin user already exists!")
        
    db.close()

if __name__ == "__main__":
    seed_admin()
