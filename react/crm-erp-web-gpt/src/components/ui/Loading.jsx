import React from 'react';
import { useUiStore } from '../../stores/uiStore.js';

export function GlobalLoading() {
  const count = useUiStore((s) => s.loadingCount);
  if (count <= 0) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/20">
      <div className="ui-card px-4 py-3 text-sm">加载中…</div>
    </div>
  );
}
