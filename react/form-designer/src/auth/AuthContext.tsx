import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppRole = "admin" | "staff";

export type AuthUser = {
    username: string;
    role: AppRole;
    displayName: string;
};

type Credentials = { username: string; password: string };

// 硬编码账号：管理员 / 普通职员（先不接后端，后续可替换为真实鉴权）
const HARDCODED_ACCOUNTS: Array<{ username: string; password: string; role: AppRole; displayName: string }> = [
    { username: "admin", password: "admin123", role: "admin", displayName: "管理员" },
    { username: "staff", password: "staff123", role: "staff", displayName: "普通职员" },
];

const STORAGE_KEY = "form-designer:auth-user";

type AuthContextValue = {
    user: AuthUser | null;
    login: (creds: Credentials) => { ok: boolean; message?: string };
    logout: () => void;
};

const AuthCtx = createContext<AuthContextValue | null>(null);

function loadPersistedUser(): AuthUser | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.role === "admin" || parsed.role === "staff")) return parsed as AuthUser;
        return null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => loadPersistedUser());

    // 仅做前端会话保持：刷新页面不用重新登录，关闭标签页后失效
    useEffect(() => {
        try {
            if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            else sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            // 忽略存储异常（隐私模式等）
        }
    }, [user]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            login: ({ username, password }) => {
                const matched = HARDCODED_ACCOUNTS.find(
                    (a) => a.username === username.trim() && a.password === password
                );
                if (!matched) return { ok: false, message: "账号或密码错误" };
                setUser({ username: matched.username, role: matched.role, displayName: matched.displayName });
                return { ok: true };
            },
            logout: () => setUser(null),
        }),
        [user]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}