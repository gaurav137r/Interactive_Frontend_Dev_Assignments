import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { displayCategory, fallbackProductImage, formatPrice, getProductById } from "../services/productService";
import { useShop } from "../store/shopStore";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, isInCart, isFavorite } = useShop();

  useEffect(() => {
    let ignore = false;

    getProductById(id)
      .then((res) => {
        if (!ignore) setProduct(res);
      })
      .catch((err) => {
        if (!ignore) console.error("Product detail error", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">Loading product...</div>;
  if (!product) return <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-700">Product not found.</div>;

  return (
    <div>
      <button className="mb-5 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="grid gap-8 lg:grid-cols-[minmax(280px,1fr)_1.3fr]">
        <img
          src={product.images?.[0] || fallbackProductImage}
          alt={product.title}
          className="aspect-[1.1/1] w-full rounded-lg border border-stone-200 bg-white object-cover shadow-sm"
          onError={(event) => {
            event.currentTarget.src = fallbackProductImage;
          }}
        />
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{displayCategory(product.category?.name)}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{product.title}</h1>
          <p className="mt-4 text-2xl font-bold text-teal-700">{formatPrice(product.price)}</p>
          <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => addToCart(product)} disabled={isInCart(product.id)}>
              {isInCart(product.id) ? "In Cart" : "Add to Cart"}
            </button>
            <button className="rounded-md bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200" onClick={() => toggleFavorite(product)}>
              {isFavorite(product.id) ? "Favorited" : "Favorite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
