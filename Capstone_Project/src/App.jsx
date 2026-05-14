import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import { ShopProvider, useShop } from "./store/shopStore";

function SiteHeader({ darkMode, onToggleDarkMode }) {
  const { cart, favorites } = useShop();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 py-5">
      <div>
        <Link to="/" className="text-3xl font-bold tracking-tight text-slate-950">
          WebStore
        </Link>
      </div>
      <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
        <Link className="rounded-full px-3 py-2 hover:bg-white" to="/">
          Home
        </Link>
        <Link className="rounded-full px-3 py-2 hover:bg-white" to="/products">
          All Products
        </Link>
        <span className="rounded-full bg-white px-3 py-2 shadow-sm">Cart: {cart.length}</span>
        <span className="rounded-full bg-white px-3 py-2 shadow-sm">Favorites: {favorites.length}</span>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="rounded-full bg-slate-950 px-3 py-2 text-white hover:bg-slate-700"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
    </header>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("webstore-dark-mode");
    if (storedTheme !== null) {
      return storedTheme === "true";
    }
    return Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("webstore-dark-mode", darkMode.toString());
  }, [darkMode]);

  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <SiteHeader darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />
          <main className="pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
