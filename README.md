# 🛒 NexusCart - Premium Full-Stack E-Commerce Storefront

NexusCart is a modern, high-performance, full-stack e-commerce web application specializing in premium electronics. It features a sleek, responsive frontend built with React and a secure Express/Node.js backend integrated with a robust MySQL database architecture.

---

## 🚀 Key Features

* **Premium Minimalist Branding:** Sleek top-navigation layout featuring an embedded vector shopping design and interactive state counters.
* **Dynamic Product Feed:** Displays electronics catalogs pulled live from a MySQL database with automatic price localized formatting ($\text{₹}$ INR).
* **Interactive Shopping Sidebar Drawer:** Add items to cart, dynamically update quantities, or remove items with synchronized subtotal tracking.
* **Bulletproof Transaction Checkout:** Robust transactional API architecture with payload parsing middleware updates ensuring safe database order creation.

---

## 🛠️ Tech Stack Architecture

### Frontend
* **React.js** (Functional components with React Hooks management)
* **Vite** (Next-generation lightning-fast frontend bundling tooling)
* **CSS-in-JS Inline Architecture** (Clean modern UI layouts without blocking scripts)

### Backend & Database
* **Node.js & Express** (API endpoints architecture setup)
* **MySQL Database** (Relational table system backing orders and inventory management)
* **CORS & Body-Parser Middleware** (Secure JSON request stream transmission structures)

---

## 📂 Project Structure

```text
E commerce/
├── backend/
│   ├── config/
│   │   └── db.js            # MySQL Database connection configuration
│   ├── server.js            # Express application entry point & API endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application file (Navbar, Feed, Cart Drawer)
│   │   └── main.jsx         # Vite rendering engine root mount target
│   └── package.json
└── .gitignore               # Keeps node_modules out of version control tracking
