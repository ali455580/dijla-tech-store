import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc, orderBy, query as fbQuery } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";

const STATUSES = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "تمت الموافقة" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التسليم" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const snap = await getDocs(
      fbQuery(collection(db, "orders"), orderBy("createdAt", "desc"))
    );
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    load();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">إدارة الطلبات</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${
            filter === "all" ? "bg-brand-600 text-white border-brand-600" : "bg-white"
          }`}
        >
          الكل
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${
              filter === s.key ? "bg-brand-600 text-white border-brand-600" : "bg-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{order.customerName} · {order.phone}</p>
                <p className="text-sm text-gray-500">{order.address}</p>
                <p className="text-xs text-gray-400 mt-1">رقم الطلب: {order.id}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 border-t pt-3 text-sm text-gray-600">
              {order.items?.map((it, idx) => (
                <p key={idx}>
                  {it.name} × {it.qty} — {it.price * it.qty} $
                </p>
              ))}
              <p className="font-bold mt-1 text-gray-800">الإجمالي: {order.total} $</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">لا توجد طلبات في هذه الحالة.</p>
        )}
      </div>
    </AdminLayout>
  );
}
