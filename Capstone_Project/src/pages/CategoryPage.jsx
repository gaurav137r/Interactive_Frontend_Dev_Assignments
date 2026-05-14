import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { displayCategory, fallbackProductImage, formatPrice, getProducts } from "../services/productService";
import { useShop } from "../store/shopStore";

function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isInCart, isFavorite } = useShop();

  const itemsPerPage = 9;

  useEffect(() => {
    let ignore = false;

    getProducts()
      .then((res) => {
        if (ignore) return;
        const filtered = (res || []).filter((product) => product.category?.name === name);
        setProducts(filtered);
        setPage(1);
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Category load error", err);
        setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [name]);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const selected = products.slice(start, start + itemsPerPage);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{displayCategory(name)} Products</h1>
          <p className="mt-1 text-slate-600">{products.length} item{products.length === 1 ? "" : "s"} found</p>
        </div>
        <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">Loading category...</div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((product) => (
              <article className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={product.id}>
                <img
                  src={product.images?.[0] || fallbackProductImage}
                  alt={product.title}
                  className="aspect-[1.15/1] w-full rounded-md object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackProductImage;
                  }}
                />
                <div className="mt-3">
                  <h3 className="line-clamp-2 min-h-12 font-semibold text-slate-900">{product.title}</h3>
                  <p className="mt-2 font-bold text-teal-700">{formatPrice(product.price)}</p>
                  <p className="text-sm text-slate-500">{displayCategory(product.category?.name)}</p>
                  <div className="mt-4 grid gap-2">
                    <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-stone-50" onClick={() => navigate(`/product/${product.id}`)}>View</button>
                    <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => addToCart(product)} disabled={isInCart(product.id)}>
                      {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                    </button>
                    <button className="rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200" onClick={() => toggleFavorite(product)}>
                      {isFavorite(product.id) ? "Favorited" : "Favorite"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Prev
            </button>
            <span className="text-sm font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryPage;
