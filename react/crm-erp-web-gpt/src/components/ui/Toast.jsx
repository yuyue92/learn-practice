import React from 'react';

const Ctx = React.createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const toast = { id, title: t.title || '提示', message: t.message || '', type: t.type || 'info' };
    setItems((s) => [toast, ...s].slice(0, 5));
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), t.duration || 2400);
  }, []);
  const value = React.useMemo(() => ({ push }), [push]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] space-y-2">
        {items.map((t) => (
          <div key={t.id} className="ui-card w-[340px] p-3">
            <div className="text-sm font-semibold">{t.title}</div>
            {t.message ? <div className="mt-1 text-xs text-slate-500">{t.message}</div> : null}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('ToastProvider missing');
  return v;
}
