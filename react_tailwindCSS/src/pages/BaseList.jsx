/*************************
* List 列表
*************************/
function cx(...xs){ return xs.filter(Boolean).join(" "); }

export default function List({ items = [], renderItem, empty = "暂无数据", className = '' }) {
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