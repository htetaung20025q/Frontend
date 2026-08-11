# Product Documentation

## Product domain

This project is an e-commerce storefront focused on a small catalog of premium home and furniture items. The product model is used in both the storefront and the admin dashboard.

## Product schema

The product schema is defined in `backend/schemas/products.py` and includes:

- `name`
- `description`
- `price`
- `stock`
- `category_id` (optional)
- `id`

### Product model fields

In `backend/models/user_model.py`, the `Product` model contains:

- `id`
- `name`
- `description`
- `price`
- `stock`
- `category_id`
- `created_at`
- `updated_at`
- `orders` relationship with `Order`

## Product catalog endpoints

### List products

- Method: `GET`
- Endpoint: `/products/`
- Query params:
  - `category_id`
  - `min_price`
  - `max_price`
  - `in_stock`

Example:

```bash
curl "http://localhost:8000/products/?in_stock=true&min_price=50"
```

### Get single product

- Method: `GET`
- Endpoint: `/products/{product_id}`

### Create product

- Method: `POST`
- Endpoint: `/products/create`
- Auth: admin only

### Update product

- Method: `POST`
- Endpoint: `/products/update`
- Auth: admin only

### Delete product

- Method: `POST`
- Endpoint: `/products/delete`
- Auth: admin only

### Upload product image

- Method: `POST`
- Endpoint: `/products/upload-image`
- Auth: admin only
- Accepts multipart image upload
- Stores images in `backend/uploads/`

## Product behavior

- Products show a stock count in the storefront.
- If stock is zero, the UI marks the product as sold out.
- When a customer places an order, stock is decremented in the backend.
- Admin users can create and edit catalog entries from the dashboard.

## Product management flow

The admin dashboard in `frontend/src/components/AdminPanel.jsx` lets admins:

- add a product
- edit product data
- delete product records
- upload an image for the product

The frontend submits to the REST API and then refreshes the product list.

## Example product data

The app is designed for a merchandising flow such as:

- name: "Lounge Chair"
- description: "Minimalist seating for modern interiors"
- price: 320.00
- stock: 12
- category_id: 1

## Notes

- Product image uploads are public on the local dev server at `/uploads/{filename}`.
- Product pricing is stored and displayed as a float value in dollars.
- The current implementation does not include category management endpoints, so `category_id` is effectively a metadata field.
