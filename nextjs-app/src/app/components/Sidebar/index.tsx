"use client";

import Link from "next/link";
import { NAV_ITEMS } from "../../types/navigation";
import useAuthStore from "@/app/store/authStore";
import { useState } from "react";

export default function Sidebar() {
  const { isAuthenticated } = useAuthStore();
  const [active, setActive] = useState("/");

  return (
    <aside className="w-60 bg-gray-900 text-gray-200 h-[calc(100vh-3.5rem)] flex flex-col p-4 shadow-lg overflow-y-auto">
      <nav className="flex-1">
        <ul className="space-y-2">
          {NAV_ITEMS.filter((item) => (isAuthenticated ||!item.requiresAuth)).map((item) => (
            <li key={item.path}>
              <Link href={item.path} onClick={() => setActive(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                active === item.path
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="text-sm text-gray-500 mt-auto">
        © 2025 ChinaSofti
      </div>
    </aside>
  );
}
