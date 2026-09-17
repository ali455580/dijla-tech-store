import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    async function load() {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
    }
    load();
  }, [id]);

  if (!product) {
    return (
      <div dir="rtl">
        <Navbar />
        <p className="text-center py-20 text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-white border rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-2 text-2xl text-brand-600 font-bold">{product.price} $</p>
          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">
            الكمية المتوفرة: {product.stock ?? 0}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min="1"
              max={product.stock ?? 99}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 border rounded-lg px-3 py-2"
            />
            <button
              disabled={!product.stock || product.stock <= 0}
              onClick={() => {
                addToCart(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="bg-brand-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
            >
              {added ? "تمت الإضافة ✓" : "أضف إلى السلة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
