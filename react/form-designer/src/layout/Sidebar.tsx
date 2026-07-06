import { cn } from "../utils/classnames";
import type { AppRole } from "../auth/AuthContext";

export type MenuKey = "designer" | "fill";

type MenuItem = {
    key: MenuKey;
    label: string;
    icon: string; // 暂不引入图标库，用字符代替
    roles: AppRole[];
};

const MENU_ITEMS: MenuItem[] = [
    { key: "designer", label: "表单设计器", icon: "🛠️", roles: ["admin"] },
    { key: "fill", label: "表单预览与填写", icon: "📝", roles: ["staff"] },
];

export function Sidebar({
    role,
    collapsed,
    onToggleCollapsed,
    active,
    onSelect,
}: {
    role: AppRole;
    collapsed: boolean;
    onToggleCollapsed: () => void;
    active: MenuKey;
    onSelect: (key: MenuKey) => void;
}) {
    const items = MENU_ITEMS.filter((m) => m.roles.includes(role));

    return (
        <div
            className={cn(
                "flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-200",
                collapsed ? "w-[64px]" : "w-[220px]"
            )}
        >
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3">
                {!collapsed && <span className="text-xs font-semibold text-slate-500">菜单</span>}
                <button
                    className="ml-auto rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                    onClick={onToggleCollapsed}
                    title={collapsed ? "展开菜单" : "收起菜单"}
                >
                    {collapsed ? "»" : "«"}
                </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {items.map((item) => {
                    const isActive = item.key === active;
                    return (
                        <button
                            key={item.key}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm",
                                isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                            )}
                            onClick={() => onSelect(item.key)}
                            title={item.label}
                        >
                            <span>{item.icon}</span>
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    );
                })}

                {items.length === 0 && !collapsed ? (
                    <div className="px-3 py-2 text-xs text-slate-400">当前角色暂无可用菜单</div>
                ) : null}
            </div>
        </div>
    );
}