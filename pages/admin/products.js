import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";

const emptyForm = { name: "", price: "", description: "", stock: "", categoryId: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [prodSnap, catSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories")),
    ]);
    setProducts(prodSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSaving(true);

    let imageUrl = form.imageUrl || "";
    if (imageFile) {
      const imgRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imgRef, imageFile);
      imageUrl = await getDownloadURL(imgRef);
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description || "",
      stock: Number(form.stock) || 0,
      categoryId: form.categoryId || null,
      imageUrl,
    };

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), payload);
    } else {
      await addDoc(collection(db, "products"), payload);
    }

    resetForm();
    setSaving(false);
    load();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      stock: p.stock || 0,
      categoryId: p.categoryId || "",
      imageUrl: p.imageUrl || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await deleteDoc(doc(db, "products", id));
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">إدارة المنتجات</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-8 grid sm:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="اسم المنتج"
          className="border rounded-lg px-3 py-2"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="السعر"
          className="border rounded-lg px-3 py-2"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="الكمية المتوفرة"
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">اختر القسم</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="الوصف"
          className="border rounded-lg px-3 py-2 sm:col-span-2"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2 flex gap-2">
          <button
            disabled={saving}
            className="bg-brand-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700"
          >
            {saving ? "جاري الحفظ..." : editingId ? "تحديث المنتج" : "إضافة المنتج"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border text-gray-600">
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border rounded-xl divide-y">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl || "/placeholder.png"}
                alt={p.name}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-500">{p.price} $ · مخزون: {p.stock}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm flex-shrink-0">
              <button onClick={() => handleEdit(p)} className="text-brand-600 hover:underline">
                تعديل
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="px-4 py-6 text-center text-gray-400">لا توجد منتجات بعد.</p>
        )}
      </div>
    </AdminLayout>
  );
}
