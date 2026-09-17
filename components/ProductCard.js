import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="block bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      <div className="aspect-square bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</h3>
        <p className="mt-1 text-brand-600 font-bold">{product.price} $</p>
        {product.stock <= 0 && (
          <span className="text-xs text-red-500">غير متوفر حالياً</span>
        )}
      </div>
    </Link>
  );
}
