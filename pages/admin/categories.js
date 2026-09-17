import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      await updateDoc(doc(db, "categories", editingId), { name });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "categories"), { name });
    }
    setName("");
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    await deleteDoc(doc(db, "categories", id));
    load();
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">إدارة الأقسام</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم القسم"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button className="bg-brand-600 text-white px-5 rounded-lg font-medium hover:bg-brand-700">
          {editingId ? "تحديث" : "إضافة"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
            className="px-4 rounded-lg border text-gray-600"
          >
            إلغاء
          </button>
        )}
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-4 py-3">
            <span>{cat.name}</span>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(cat)} className="text-brand-600 hover:underline">
                تعديل
              </button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-gray-400">لا توجد أقسام بعد.</p>
        )}
      </div>
    </AdminLayout>
  );
}
