import React from 'react';
import Button from './Button.jsx';

export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-slate-500">共 {total} 条 / {pages} 页</div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}>上一页</Button>
        <div className="px-2">{page}</div>
        <Button variant="ghost" onClick={() => onChange(Math.min(pages, page + 1))} disabled={page >= pages}>下一页</Button>
      </div>
    </div>
  );
}
