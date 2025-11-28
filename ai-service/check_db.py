from database import SessionLocal
from models import Product

db = SessionLocal()
count = db.query(Product).count()
print(f"Product count: {count}")
products = db.query(Product).limit(5).all()
for p in products:
    print(f"- {p.name}")
db.close()
