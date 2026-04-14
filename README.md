# Totos Bliss Baby Shop

Totos Bliss is a full-stack e-commerce web application designed for a baby products store. It allows customers to browse products, add items to cart, and place orders, while providing an admin dashboard for managing inventory, orders, and deliveries.

---

## Live Demo

https://your-vercel-link.vercel.app

---

## Overview

This application simulates a real-world online baby shop with both customer-facing and admin-facing functionality.

It focuses on:
- Clean user experience
- Simple checkout flow
- Practical admin management
- Real business usability

---

## Features

### Customer Features
- Browse baby products
- Search, filter, and sort products
- Add items to cart
- Remove items from cart
- View cart totals (VAT included)
- Secure checkout with delivery details
- Password reset functionality
- WhatsApp support for quick inquiries

### Admin Features
- Admin authentication
- Inventory management (create, edit, delete products)
- Product image upload
- Order management
- Delivery tracking
- In-app success and error messages

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- CSS

### Backend
- Flask
- Flask JWT Extended
- SQLAlchemy
- PostgreSQL
- bcrypt

---

## Project Structure

Totos_Bliss_Babyshop/


├── frontend/ # React application


├── backend/      # Flask API


└── README.md

---

## Local Setup

### Clone Repository

git clone https://github.com/your-username/totos-bliss.git  
cd totos-bliss

---

### Backend Setup

cd backend  
python3 -m venv venv  
source venv/bin/activate  

pip install -r requirements.txt  
python3 run.py  

Backend runs on:  
http://127.0.0.1:5000  

---

### Frontend Setup

cd frontend  
npm install  
npm run dev  

Frontend runs on:  
http://localhost:5173  

---

## Environment Configuration

Create a .env file inside the frontend folder:

VITE_API_URL=http://127.0.0.1:5000/api  

For production:

VITE_API_URL=https://your-backend-url/api  

---

## Authentication

- JWT-based authentication
- Token stored in localStorage
- Token attached automatically to API requests
- Admin access controlled via user role

---

## Admin Access

Email: admin@totos.com  
Password: admin123  

---

## How It Works

### Customer Flow
1. Visit homepage
2. Browse products
3. Add items to cart
4. View cart
5. Proceed to checkout
6. Enter delivery details
7. Place order

### Admin Flow
1. Log in as admin
2. Access dashboard
3. Manage products
4. View orders
5. Manage deliveries

---

## Deployment

### Frontend (Vercel)
Build command:
npm run build  

Output directory:
dist  

---

### Backend (Render)
Build command:
pip install -r requirements.txt  

Start command:
python3 run.py  

---

## Important

Ensure frontend points to deployed backend:

VITE_API_URL=https://your-render-backend/api  

---

## Key Design Decisions

- Customers do not see stock quantities
- Admin has full control over inventory
- Cart updates dynamically
- Alerts handled within UI (not browser alerts)
- WhatsApp support integrated

---

## Future Improvements

- M-Pesa integration
- Email notifications
- Order history for users
- Product categories
- Payment gateway integration

---

## Author

Crispus Ng’ang’a  
Full-stack Developer  

---

## Final Note

This project is built as a practical, real-world e-commerce solution focused on usability, clarity, and business relevance.
