import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Breadcrumbs() {
  const loc = useLocation();
  const parts = loc.pathname.split('/').filter(Boolean);
  const crumbs = parts.map((p, idx) => ({
    label: p,
    to: '/' + parts.slice(0, idx + 1).join('/')
  }));

  return (
    <div className="text-xs text-slate-500">
      <Link to="/" className="hover:underline">首页</Link>
      {crumbs.map((c) => (
        <span key={c.to}>
          <span className="mx-1">/</span>
          <Link to={c.to} className="hover:underline">{c.label}</Link>
        </span>
      ))}
    </div>
  );
}
