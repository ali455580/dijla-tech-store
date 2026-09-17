import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import ProtectedRoute from "./ProtectedRoute";

const LINKS = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/categories", label: "الأقسام" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/orders", label: "الطلبات" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div dir="rtl" className="min-h-screen bg-gray-50 flex">
        <aside className="w-56 bg-white border-l min-h-screen p-4">
          <h2 className="font-bold text-brand-600 mb-6">لوحة التحكم</h2>
          <nav className="space-y-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  router.pathname === link.href
                    ? "bg-brand-50 text-brand-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
              className="w-full text-right px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 mt-4"
            >
              تسجيل الخروج
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
