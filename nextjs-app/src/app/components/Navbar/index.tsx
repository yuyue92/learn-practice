"use client";

import useAuthStore from "@/app/store/authStore";
import { redirect } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated ,currentUser, logout } = useAuthStore();
  const handleLogout = ()=>{
    logout();
    setTimeout(() => {
      redirect('/login')
    }, 500);
  }
  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-4 shadow">
      {/* 左侧 Logo / 标题 */}
      <div className="text-lg font-semibold text-gray-300">Dashboard</div>

      {/* 右侧 用户操作 */}
      <div className="flex items-center gap-4">
        {isAuthenticated && <div className="p-1">
          <span className="p-1 m-2">Hello, {currentUser.username}</span>
          <button className="px-1 m-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={handleLogout}>退出</button>
        </div>}
      </div>
    </header>
  );
}
