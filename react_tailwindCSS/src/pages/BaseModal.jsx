import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
function cx(...xs) { return xs.filter(Boolean).join(" "); }

/*************************
* Modal 弹窗（Portal + 焦点圈定 + ESC/遮罩关闭）
*************************/

function useFocusTrap(ref, active) {
    useEffect(() => {
        if (!active || !ref.current) return;
        const el = ref.current;
        const selectables = () => Array.from(el.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter(n => !n.hasAttribute('disabled'));
        const first = () => selectables()[0] || el;
        const handler = (e) => {
            if (e.key !== 'Tab') return;
            const list = selectables();
            if (!list.length) return e.preventDefault();
            const firstEl = list[0];
            const lastEl = list[list.length - 1];
            if (e.shiftKey && document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
        };
        first().focus({ preventScroll: true });
        el.addEventListener('keydown', handler);
        return () => el.removeEventListener('keydown', handler);
    }, [ref, active]);
}

export default function Modal({ open, onOpenChange, title, children, footer, closeOnEsc = true, closeOnOutside = true, size = 'md' }) {
    const [container] = useState(() => {
        const d = document.createElement('div');
        d.setAttribute('data-modal-root', '');
        return d;
    });
    const dialogRef = useRef(null);


    useEffect(() => { document.body.appendChild(container); return () => { container.remove(); }; }, [container]);
    useFocusTrap(dialogRef, open);

    useEffect(() => {
        if (!open || !closeOnEsc) return;
        const onKey = (e) => { if (e.key === 'Escape') onOpenChange?.(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, closeOnEsc, onOpenChange]);


    if (!open) return null;
    const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };


    return createPortal(
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onMouseDown={(e) => { if (closeOnOutside && e.target === e.currentTarget) onOpenChange?.(false); }} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    ref={dialogRef}
                    role="dialog" aria-modal="true" aria-labelledby="modalTitle"
                    className={cx("w-full", sizeMap[size] || sizeMap.md, "bg-white rounded-2xl shadow-xl border outline-none animate-in fade-in zoom-in-95")}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h3 id="modalTitle" className="font-semibold">{title}</h3>
                        <button variant="ghost" className="p-2" onClick={() => onOpenChange?.(false)} aria-label="关闭">
                            <span aria-hidden>✕</span>
                        </button>
                    </div>
                    <div className="px-4 py-4 max-h-[70vh] overflow-auto">{children}</div>
                    <div className="px-4 py-3 border-t flex justify-end gap-2">{footer}</div>
                </div>
            </div>
        </div>,
        container
    );
}