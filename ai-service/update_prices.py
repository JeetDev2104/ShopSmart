from database import SessionLocal
from models import Product

def update_product_prices():
    db = SessionLocal()
    
    # Product price updates
    updates = {
        '1022': 5000.90,
        '1021': 790.0,
        '1020': 4500.0
    }
    
    for product_id, new_price in updates.items():
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            old_price = product.price
            product.price = new_price
            print(f"Updated Product ID {product_id} ({product.name}): ${old_price} -> ${new_price}")
        else:
            print(f"Product ID {product_id} not found in database")
    
    db.commit()
    print("\nAll prices updated successfully!")
    db.close()

if __name__ == "__main__":
    update_product_prices()
