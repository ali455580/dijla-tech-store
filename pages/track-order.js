import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";

const STATUS_STEPS = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "تمت الموافقة" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التسليم" },
];

export default function TrackOrder() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.orderId) setOrderId(router.query.orderId.toString());
  }, [router.query.orderId]);

  useEffect(() => {
    if (!orderId) return;
    setError("");
    const unsub = onSnapshot(
      doc(db, "orders", orderId),
      (snap) => {
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() });
        } else {
          setOrder(null);
          setError("لم يتم العثور على طلب بهذا الرقم.");
        }
      },
      () => setError("حدث خطأ أثناء البحث عن الطلب.")
    );
    return () => unsub();
  }, [orderId]);

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">تتبع الطلب</h1>

        <div className="flex gap-2 mb-6">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="أدخل رقم الطلب"
            className="flex-1 border rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {order && (
          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-4">رقم الطلب: {order.id}</p>
            <div className="space-y-3">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      idx <= currentStepIndex ? "bg-brand-600" : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={
                      idx <= currentStepIndex
                        ? "text-gray-800 font-medium"
                        : "text-gray-400"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-1">
              <p>الاسم: {order.customerName}</p>
              <p>الهاتف: {order.phone}</p>
              <p>الإجمالي: {order.total} $</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
