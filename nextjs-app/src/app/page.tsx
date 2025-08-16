"use client";
import { useState } from "react";

export default function Home() {
  
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "settings", label: "Settings"},
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to Next.js Routing Demo</h1>
      <p className="text-lg">
        This is a demonstration of routing and menu functionality in Next.js with
        TypeScript.
      </p>
      <p className="p-2 m-2 border">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          主按钮
        </button>

        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          次按钮
        </button>

        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          确认
        </button>

        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          删除
        </button>
      </p>
      <ul className="divide-y divide-gray-200 max-w-md mx-auto bg-white shadow rounded">
        <li className="px-4 py-2 hover:bg-gray-50">用户 1</li>
        <li className="px-4 py-2 hover:bg-gray-50">用户 2</li>
        <li className="px-4 py-2 hover:bg-gray-50">用户 3</li>
      </ul>



    </div>
  );
}