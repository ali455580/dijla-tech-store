import { useEffect, useState } from "react";
import { collection, getDocs, query as fbQuery, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0 });

  useEffect(() => {
    async function load() {
      const productsSnap = await getDocs(collection(db, "products"));
      const ordersSnap = await getDocs(collection(db, "orders"));
      const pendingSnap = await getDocs(
        fbQuery(collection(db, "orders"), where("status", "==", "pending"))
      );
      setStats({
        products: productsSnap.size,
        orders: ordersSnap.size,
        pending: pendingSnap.size,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "إجمالي المنتجات", value: stats.products },
    { label: "إجمالي الطلبات", value: stats.orders },
    { label: "طلبات قيد المراجعة", value: stats.pending },
  ];

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">نظرة عامة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-3xl font-bold text-brand-600 mt-2">{c.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
