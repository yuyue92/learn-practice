import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Sidebar, type MenuKey } from "./Sidebar";
import { RoleProvider } from "../auth/RoleContext";
import { FormDesigner } from "../designer/FormDesigner";
import { FormFillPage } from "../pages/FormFillPage";
import type { AppRole } from "../auth/AuthContext";

function defaultMenuForRole(role: AppRole): MenuKey {
    return role === "admin" ? "designer" : "fill";
}

export function AppShell() {
    const { user, logout } = useAuth();

    // 由上层 App.tsx 保证只有登录后才渲染 AppShell，这里做个兜底
    if (!user) return null;

    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState<MenuKey>(() => defaultMenuForRole(user.role));

    return (
        <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-slate-50">
            {/* 顶部状态条 */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Form Designer</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {user.role === "admin" ? "管理员视图" : "普通职员视图"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">
                        当前用户：<span className="font-medium text-slate-900">{user.displayName}</span>
                        <span className="ml-1 text-xs text-slate-400">({user.username})</span>
                    </span>
                    <button
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                        onClick={logout}
                    >
                        退出登录
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                <Sidebar
                    role={user.role}
                    collapsed={collapsed}
                    onToggleCollapsed={() => setCollapsed((v) => !v)}
                    active={active}
                    onSelect={setActive}
                />

                <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                    {active === "designer" ? (
                        // 表单设计器内部有一套细粒度权限系统（RoleContext），这里固定用 admin 角色
                        <RoleProvider role="admin">
                            <FormDesigner />
                        </RoleProvider>
                    ) : (
                        // 表单预览与填写：映射到细粒度权限的 "user" 角色（不可导出 values，可按需调整）
                        <RoleProvider role="user">
                            <FormFillPage />
                        </RoleProvider>
                    )}
                </div>
            </div>
        </div>
    );
}