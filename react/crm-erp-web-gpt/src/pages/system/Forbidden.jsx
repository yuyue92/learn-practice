import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="ui-card w-[520px] p-6">
        <div className="text-xl font-semibold">403 无权限</div>
        <div className="mt-2 text-sm text-slate-500">当前角色无权访问该模块。</div>
        <Link className="mt-4 inline-block text-sm text-brand-600 hover:underline" to="/">返回首页</Link>
      </div>
    </div>
  );
}
