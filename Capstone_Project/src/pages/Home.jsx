import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayCategory, fallbackProductImage, formatPrice, getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res || []))
      .catch((err) => {
        console.error("API ERROR:", err);
        setError("Unable to load products. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = {};
    products.forEach((product) => {
      const category = product.category?.name || "miscellaneous";
      if (!map[category]) map[category] = [];
      map[category].push(product);
    });
    return Object.keys(map).map((category) => ({
      category,
      title: displayCategory(category),
      items: map[category],
    }));
  }, [products]);

  if (loading) return <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">Loading products...</div>;
  if (error) return <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-700">{error}</div>;

  return (
    <div>
      <section className="mb-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Welcome to WebStore</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Explore clean categories, view products, and add items to your cart or favorites.
        </p>
      </section>

      {categories.map(({ category, title, items }) => (
        <section key={category} className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            <button
              onClick={() => navigate(`/category/${category}`)}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Show More
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {items.slice(0, 5).map((product) => (
              <article
                className="min-w-56 rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                key={product.id}
              >
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
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Home;
