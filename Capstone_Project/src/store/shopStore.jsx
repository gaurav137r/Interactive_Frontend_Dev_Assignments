import { createContext, useContext, useEffect, useState } from "react";

const ShopContext = createContext(null);

const STORAGE_CART_KEY = "webstore-cart";
const STORAGE_FAV_KEY = "webstore-favorites";

const readStoredList = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.warn("Could not load shop state", error);
    return [];
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStoredList(STORAGE_CART_KEY));
  const [favorites, setFavorites] = useState(() => readStoredList(STORAGE_FAV_KEY));

  useEffect(() => {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product) => {
    setCart((current) => {
      if (current.some((item) => item.id === product.id)) return current;
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const toggleFavorite = (product) => {
    setFavorites((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  };

  const isInCart = (productId) => cart.some((item) => item.id === productId);
  const isFavorite = (productId) => favorites.some((item) => item.id === productId);

  const value = { cart, favorites, addToCart, removeFromCart, toggleFavorite, isInCart, isFavorite };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside a ShopProvider");
  }
  return context;
}
