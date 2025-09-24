/*************************
* Button 按钮
*************************/
function cx(...xs){ return xs.filter(Boolean).join(" "); }

export default function Button({ as: Comp = 'button', variant = 'primary', size = 'md', className = '', disabled, ...props }) {
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