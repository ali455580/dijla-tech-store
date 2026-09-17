import { useState } from "react";
import { useRouter } from "next/router";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError("الرجاء تعبئة جميع الحقول.");
      return;
    }
    if (items.length === 0) {
      setError("السلة فارغة.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      clearCart();
      router.push(`/track-order?orderId=${orderRef.id}`);
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الطلب، حاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">إتمام الطلب (كزائر)</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">الاسم الكامل</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">رقم الهاتف</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">العنوان</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>الإجمالي</span>
            <span>{total} $</span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 disabled:bg-gray-300 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
          >
            {submitting ? "جاري الإرسال..." : "تأكيد الطلب"}
          </button>
        </form>
      </div>
    </div>
  );
}
