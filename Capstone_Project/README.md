# WebStore React App

A simple ecommerce demo built with React and Vite.

## Implemented Features

- **API / Data Integration**
  - Fetches product data from a public REST API (`https://api.escuelajs.co/api/v1/products`).
- **Pagination**
  - Category pages display products in pages of 9 items.
- **Routing**
  - Home page, category listing page, all-products page, and detailed product page.
- **Product detail page**
  - Shows full product information, description, and image.
- **Cart and favorites state**
  - Add products to cart and toggle items as favorites.
  - Cart and favorite counters are shown in the site header.
- **Error handling**
  - Handles API failures and shows a simple error message when products cannot be loaded.
- **Dark mode toggle**
  - Users can switch between light and dark themes, with preference stored locally.
- **Responsive layout**
  - Uses responsive CSS for product cards and pages.


## How to run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at:

```text
http://localhost:5173
```

## Netlify deployment

This project is deployed on Netlify.
https://webstorecapstone.netlify.app/

## Project structure

- `src/App.jsx` — main app routing and page layout
- `src/pages/Home.jsx` — homepage with category sections
- `src/pages/CategoryPage.jsx` — category listing with pagination
- `src/pages/ProductDetail.jsx` — single product detail view
- `src/pages/Products.jsx` — all-products listing page
- `src/store/shopStore.jsx` — shared cart/favorites state
- `src/services/productService.js` — API fetch helpers
- `src/index.css` — application styling
