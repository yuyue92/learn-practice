import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/*************************
 * 小工具
 *************************/
function cx(...xs) { return xs.filter(Boolean).join(" "); }
const isNil = (v) => v === undefined || v === null;

/*************************
 * Button 按钮
 *************************/
function Button({ as: Comp = 'button', variant = 'primary', size = 'md', className = '', disabled, ...props }) {
    const base = "inline-flex items-center justify-center rounded-2xl border shadow-sm transition focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500",
        outline: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-50",
        danger: "bg-rose-600 text-white border-rose-600 hover:bg-rose-500",
    };
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
    };
    return (
        <Comp disabled={disabled} className={cx(base, variants[variant], sizes[size], className)} {...props} />
    );
}

/*************************
 * 输入控件：TextInput / Select / Checkbox / Textarea / RadioGroup
 *************************/
function FieldWrapper({ label, htmlFor, hint, error, children }) {
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={htmlFor} className="text-sm text-slate-700">
                    {label}
                </label>
            )}
            {children}
            <div className="min-h-[1rem] text-xs">
                {error ? (
                    <span className="text-rose-600">{error}</span>
                ) : hint ? (
                    <span className="text-slate-500">{hint}</span>
                ) : null}
            </div>
        </div>
    );
}

function baseInputClassName(error) {
    return cx(
        "w-full rounded-xl border px-3 py-2 outline-none bg-white",
        error ? "border-rose-500 focus:ring focus:ring-rose-200" : "border-slate-300 focus:ring focus:ring-indigo-200"
    );
}

function TextInput({ id, label, hint, error, className = '', ...props }) {
    const _id = id || `ti_${Math.random().toString(36).slice(2)}`;
    return (
        <FieldWrapper label={label} htmlFor={_id} hint={hint} error={error}>
            <input id={_id} className={cx(baseInputClassName(error), className)} {...props} />
        </FieldWrapper>
    );
}

function Select({ id, label, hint, error, children, className = '', ...props }) {
    const _id = id || `sel_${Math.random().toString(36).slice(2)}`;
    return (
        <FieldWrapper label={label} htmlFor={_id} hint={hint} error={error}>
            <select id={_id} className={cx(baseInputClassName(error), className)} {...props}>
                {children}
            </select>
        </FieldWrapper>
    );
}

function Checkbox({ id, label, hint, error, className = '', ...props }) {
    const _id = id || `cb_${Math.random().toString(36).slice(2)}`;
    return (
        <div className="space-y-1">
            <label htmlFor={_id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input id={_id} type="checkbox" className={cx("rounded border-slate-300", className)} {...props} />
                {label}
            </label>
            <div className="min-h-[1rem] text-xs">
                {error ? <span className="text-rose-600">{error}</span> : hint ? <span className="text-slate-500">{hint}</span> : null}
            </div>
        </div>
    );
}

function Textarea({ id, label, hint, error, className = '', rows = 3, ...props }) {
    const _id = id || `ta_${Math.random().toString(36).slice(2)}`;
    return (
        <FieldWrapper label={label} htmlFor={_id} hint={hint} error={error}>
            <textarea id={_id} rows={rows} className={cx(baseInputClassName(error), className)} {...props} />
        </FieldWrapper>
    );
}

function RadioGroup({ label, name, options = [], value, onChange, error, hint }) {
    return (
        <div className="space-y-1">
            {label && <div className="text-sm text-slate-700">{label}</div>}
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <label key={opt.value} className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={(e) => onChange?.(e.target.value)}
                            className="rounded-full border-slate-300"
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>
            <div className="min-h-[1rem] text-xs">
                {error ? <span className="text-rose-600">{error}</span> : hint ? <span className="text-slate-500">{hint}</span> : null}
            </div>
        </div>
    );
}

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

function Modal({ open, onOpenChange, title, children, footer, closeOnEsc = true, closeOnOutside = true, size = 'md' }) {
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
                        <Button variant="ghost" className="p-2" onClick={() => onOpenChange?.(false)} aria-label="关闭">
                            <span aria-hidden>✕</span>
                        </Button>
                    </div>
                    <div className="px-4 py-4 max-h-[70vh] overflow-auto">{children}</div>
                    <div className="px-4 py-3 border-t flex justify-end gap-2">{footer}</div>
                </div>
            </div>
        </div>,
        container
    );
}

/*************************
 * List 列表
 *************************/
function List({ items = [], renderItem, empty = "暂无数据", className = '' }) {
    if (!items.length) return <div className="text-sm text-slate-500 py-6 text-center">{empty}</div>;
    return (
        <div className={cx("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {items.map((item, idx) => (
                <div key={item.id ?? idx} className="p-4 rounded-2xl border bg-white hover:shadow-sm transition">
                    {renderItem ? renderItem(item, idx) : <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>}
                </div>
            ))}
        </div>
    );
}

/*************************
 * DataTable 表格：排序/分页/搜索/自定义单元格
 *************************/
function DataTable({ columns = [], data = [], pageSize = 8, query = '', onQueryChange }) {
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => { setPage(1); }, [query, data]);

    const filtered = useMemo(() => {
        const q = (query || '').toLowerCase();
        if (!q) return data;
        return data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    }, [data, query]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        const col = columns.find(c => c.key === sortKey);
        const acc = col && (col.sortAccessor || col.accessor || ((row) => row[sortKey]));
        const factor = sortDir === 'asc' ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const va = acc(a); const vb = acc(b);
            if (isNil(va) && isNil(vb)) return 0; if (isNil(va)) return -1 * factor; if (isNil(vb)) return 1 * factor;
            if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * factor;
            return String(va).localeCompare(String(vb), undefined, { numeric: true }) * factor;
        });
    }, [filtered, sortKey, sortDir, columns]);

    const total = Math.max(1, Math.ceil(sorted.length / pageSize));
    const pageData = useMemo(() => sorted.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [sorted, page, pageSize]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); }
    };

    return (
        <div className="border rounded-2xl overflow-hidden bg-white">
            {/* 顶部工具条（搜索） */}
            {onQueryChange && (
                <div className="px-3 py-2 border-b bg-slate-50 flex items-center gap-2">
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="搜索..."
                        className="w-full sm:w-72 rounded-xl border px-3 py-2 outline-none focus:ring focus:ring-indigo-200"
                    />
                </div>
            )}

            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className={cx("border-b", col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}>
                                <button
                                    className={cx("px-3 py-2 w-full text-left font-medium flex items-center gap-1", col.sortable && 'hover:bg-slate-100 rounded')}
                                    onClick={() => col.sortable && toggleSort(col.key)}
                                >
                                    {col.header || col.label}
                                    {col.sortable && (
                                        <span className="inline-block w-4 h-4" aria-hidden>
                                            {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                        </span>
                                    )}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pageData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-slate-500 py-8">暂无数据</td>
                        </tr>
                    ) : pageData.map((row, i) => (
                        <tr key={row.id ?? i} className="border-b hover:bg-slate-50">
                            {columns.map((col) => {
                                const value = col.accessor ? col.accessor(row) : row[col.key];
                                return (
                                    <td key={col.key} className={cx("px-3 py-2", col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}>
                                        {col.cell ? col.cell({ value, row }) : (isNil(value) ? '' : String(value))}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 分页 */}
            <div className="flex items-center justify-between px-3 py-2 border-t bg-slate-50">
                <div className="text-xs text-slate-600">第 {page} / {total} 页 · 共 {sorted.length} 条</div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>首页</Button>
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>上一页</Button>
                    <Button variant="outline" size="sm" disabled={page === total} onClick={() => setPage(p => p + 1)}>下一页</Button>
                    <Button variant="outline" size="sm" disabled={page === total} onClick={() => setPage(total)}>末页</Button>
                </div>
            </div>
        </div>
    );
}

/*************************
 * useForm & Form（基于配置的表单构建器）
 *************************/
function useForm({ fields = [], initialValues = {} }) {
    const [values, setValues] = useState(() => ({ ...initialValues }));
    const [errors, setErrors] = useState({});

    const setValue = (name, val) => setValues(v => ({ ...v, [name]: val }));
    const getValue = (name) => values[name];
    const reset = () => { setValues({ ...initialValues }); setErrors({}); };

    const validate = () => {
        const errs = {};
        const setErr = (name, msg) => { (errs[name] ||= []).push(msg); };
        for (const f of fields) {
            const v = values[f.name];
            if (f.required && (isNil(v) || v === '' || (Array.isArray(v) && v.length === 0))) setErr(f.name, '必填');
            if (f.pattern && v) { const re = new RegExp(f.pattern); if (!re.test(String(v))) setErr(f.name, '格式不正确'); }
            if (f.min != null && v != null && Number(v) < f.min) setErr(f.name, `最小值 ${f.min}`);
            if (f.max != null && v != null && Number(v) > f.max) setErr(f.name, `最大值 ${f.max}`);
            if (typeof f.validate === 'function') { const msg = f.validate(v, values); if (msg) setErr(f.name, msg); }
        }
        setErrors(errs);
        return { valid: Object.keys(errs).length === 0, errors: errs };
    };

    return { values, setValues, setValue, getValue, errors, setErrors, reset, validate };
}

function Form({ fields = [], initialValues = {}, submitText = '提交', onSubmit }) {
    const form = useForm({ fields, initialValues });

    const submit = (e) => {
        e?.preventDefault?.();
        const r = form.validate();
        if (!r.valid) return;
        onSubmit?.(form.values);
    };

    return (
        <form className="grid sm:grid-cols-2 gap-4" onSubmit={submit}>
            {fields.map((f) => {
                const common = { error: form.errors[f.name]?.join('，'), hint: f.hint };
                const v = form.values[f.name];
                const set = (val) => form.setValue(f.name, val);
                switch (f.type) {
                    case 'select':
                        return (
                            <Select key={f.name} label={f.label} value={v ?? ''} onChange={(e) => set(e.target.value)} {...common}>
                                <option value="">请选择</option>
                                {(f.options || []).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </Select>
                        );
                    case 'textarea':
                        return (
                            <Textarea key={f.name} label={f.label} value={v ?? ''} onChange={(e) => set(e.target.value)} rows={f.rows || 3} {...common} />
                        );
                    case 'checkbox':
                        return (
                            <div key={f.name} className="sm:col-span-2">
                                <Checkbox label={f.label} checked={!!v} onChange={(e) => set(e.target.checked)} {...common} />
                            </div>
                        );
                    case 'radio-group':
                        return (
                            <div key={f.name} className="sm:col-span-2">
                                <RadioGroup label={f.label} name={f.name} options={f.options || []} value={v} onChange={set} {...common} />
                            </div>
                        );
                    default:
                        return (
                            <TextInput key={f.name} label={f.label} type={f.type || 'text'} value={v ?? ''} onChange={(e) => set(e.target.value)} placeholder={f.placeholder} {...common} />
                        );
                }
            })}
            <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={form.reset}>重置</Button>
                <Button type="submit">{submitText}</Button>
            </div>
        </form>
    );
}

/*************************
 * Badge 小徽章（表格示例用）
 *************************/
function Badge({ children, color = 'indigo' }) {
    const colorMap = {
        indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        slate: "bg-slate-100 text-slate-700 border border-slate-200",
        rose: "bg-rose-50 text-rose-700 border border-rose-200",
    };
    return <span className={cx("px-2 py-0.5 rounded-full text-xs", colorMap[color] || colorMap.indigo)}>{children}</span>;
}


// 导出你可能在项目里复用的组件
export { Button, TextInput, Select, Checkbox, Textarea, RadioGroup, Modal, List, DataTable, useForm, Form, Badge };
