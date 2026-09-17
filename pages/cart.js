import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, updateQty, removeFromCart, total } = useCart();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">سلة التسوق</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            السلة فارغة. <Link href="/" className="text-brand-600 underline">تصفح المنتجات</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-brand-600 font-bold">{item.price} $</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    className="w-16 border rounded-lg px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <span className="text-lg font-bold">الإجمالي: {total} $</span>
              <Link
                href="/checkout"
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
              >
                إتمام الطلب
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
