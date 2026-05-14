import fallbackImage from "../assets/fallback.png";

const API_URL = "https://api.escuelajs.co/api/v1/products";

const allowedCategories = [
  "electronics",
  "furniture",
  "miscellaneous",
  "shoes",
  "ammr 23",
];

const normalizeImageUrl = (image) => {
  if (Array.isArray(image)) return normalizeImageUrl(image[0]);
  if (!image || typeof image !== "string") return fallbackImage;

  const trimmed = image.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return normalizeImageUrl(parsed[0]);
    if (typeof parsed === "string") return normalizeImageUrl(parsed);
  } catch {
    // Valid image URLs are not JSON, so keep cleaning the raw string below.
  }

  const cleaned = trimmed.replace(/^\[?["']?/, "").replace(/["']?\]?$/, "");
  return /^https?:\/\//i.test(cleaned) ? cleaned : fallbackImage;
};

export const normalizeCategory = (categoryName) => {
  const name = String(categoryName || "").trim().toLowerCase();
  if (name === "ammr 23") return "fashion";
  return name;
};

export const displayCategory = (categoryName) => {
  if (!categoryName) return "Miscellaneous";
  return categoryName
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const fallbackProductImage = fallbackImage;

export const formatPrice = (price) => {
  const value = Number(price);
  return Number.isFinite(value) ? `$${value.toFixed(2)}` : "$0.00";
};

const isAllowedProduct = (product) => {
  const name = product.category?.name?.toLowerCase();
  return allowedCategories.includes(name);
};

const prepareProduct = (product) => {
  const images = Array.isArray(product.images) ? product.images : [product.images];
  const safeImages = images.map(normalizeImageUrl).filter(Boolean);

  return {
    ...product,
    category: {
      ...product.category,
      name: normalizeCategory(product.category?.name),
    },
    images: safeImages.length ? safeImages : [fallbackImage],
  };
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getProducts = async () => {
  const data = await fetchJson(API_URL);
  return (data || []).filter(isAllowedProduct).map(prepareProduct);
};

export const getProductById = async (id) => {
  const data = await fetchJson(`${API_URL}/${id}`);
  if (!isAllowedProduct(data)) return null;
  return prepareProduct(data);
};
