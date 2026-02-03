import React from 'react';

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="ui-card w-[720px] max-w-[95vw] p-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
          <div className="text-sm font-semibold">{title}</div>
          <button className="ui-btn ui-btn-ghost" onClick={onClose} type="button">关闭</button>
        </div>
        <div className="py-4">{children}</div>
        {footer === null ? null : (
          <div className="border-t border-slate-200/60 pt-3 dark:border-slate-800/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
