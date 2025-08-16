"use client";
import Link from "next/link";
import { useState } from "react";
import useAuthStore from "../store/authStore";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [uname, setuname] = useState('');
  const [pwd, setpwd] = useState('');
  const handleLogin = ()=>{
    if(uname==='') return
    login({
      username: uname,
      password: pwd
    });
    redirect('/')
  }
  const { login } = useAuthStore();
  return (
    <div className="flex items-center justify-center m-12">
      <div className="p-6 m-2 border rounded w-80">
        <div className="space-y-4 max-w-sm mx-auto">
          <div>
            <label className="block text-sm font-medium mb-1">用户名</label>
            <input
              type="text" value={uname} onChange={e => setuname(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input
              type="password" value={pwd} onChange={e => setpwd(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleLogin} className="p-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700">
              登录
            </button>
          </div>
          <div className="flex justify-end">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}