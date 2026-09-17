import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_UID) {
        setAuthorized(true);
      } else {
        router.replace("/admin/login");
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  if (checking) return <p className="p-10 text-center text-gray-500">جاري التحقق...</p>;
  if (!authorized) return null;

  return children;
}
