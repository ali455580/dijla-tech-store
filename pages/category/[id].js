import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query as fbQuery, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const catSnap = await getDoc(doc(db, "categories", id));
      if (catSnap.exists()) setCategory({ id: catSnap.id, ...catSnap.data() });

      const prodSnap = await getDocs(
        fbQuery(collection(db, "products"), where("categoryId", "==", id))
      );
      setProducts(prodSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [id]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">{category?.name || "القسم"}</h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-16">لا توجد منتجات في هذا القسم بعد.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
