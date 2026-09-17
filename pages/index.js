import { useEffect, useState } from "react";
import { collection, getDocs, query as fbQuery, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/router";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchTerm = (router.query.search || "").toString().toLowerCase();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const catsSnap = await getDocs(collection(db, "categories"));
      setCategories(catsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const prodsSnap = await getDocs(collection(db, "products"));
      setProducts(prodsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory ? p.categoryId === activeCategory : true;
    const matchesSearch = searchTerm ? p.name?.toLowerCase().includes(searchTerm) : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
              !activeCategory ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-700"
            }`}
          >
            الكل
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                activeCategory === c.id
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-20">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">لا توجد منتجات مطابقة.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
