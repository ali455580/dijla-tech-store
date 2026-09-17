import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-brand-600 whitespace-nowrap">
          دجلة تكنو
        </Link>

        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن جهاز..."
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <Link href="/track-order" className="text-sm text-gray-600 hover:text-brand-600 whitespace-nowrap">
          تتبع طلبي
        </Link>

        <Link href="/cart" className="relative text-sm font-medium text-gray-700 hover:text-brand-600">
          السلة
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
