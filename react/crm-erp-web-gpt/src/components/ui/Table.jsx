import React from 'react';

export default function Table({ columns, rows, actionsRender }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-950">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-200">
                {c.title}
              </th>
            ))}
            {actionsRender ? <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-200">操作</th> : null}
          </tr>
        </thead>
        <tbody>
          {(rows || []).map((r) => (
            <tr key={r.id} className="border-t border-slate-200/50 hover:bg-slate-50/60 dark:border-slate-800/50 dark:hover:bg-slate-900/40">
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-3 py-2">
                  {c.render ? c.render(r) : (r[c.key] ?? '-')}
                </td>
              ))}
              {actionsRender ? <td className="px-3 py-2 text-right">{actionsRender(r)}</td> : null}
            </tr>
          ))}
          {(!rows || rows.length === 0) ? (
            <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={(columns.length + (actionsRender ? 1 : 0))}>暂无数据</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
