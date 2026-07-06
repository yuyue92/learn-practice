import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

const QUICK_ACCOUNTS = [
    { label: "管理员演示账号", username: "admin", password: "admin123" },
    { label: "普通职员演示账号", username: "staff", password: "staff123" },
];

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = login({ username, password });
        if (!result.ok) {
            setError(result.message ?? "登录失败");
            return;
        }
        setError(null);
    }

    function fillQuick(u: string, p: string) {
        setUsername(u);
        setPassword(p);
        setError(null);
    }

    return (
        <div className="flex h-[100dvh] w-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-1 text-xl font-semibold text-slate-900">Form Designer</div>
                <div className="mb-6 text-sm text-slate-500">请登录以继续</div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">账号</label>
                        <input
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin / staff"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">密码</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                        />
                    </div>

                    {error ? <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        登录
                    </button>
                </form>

                <div className="mt-6 border-t border-slate-100 pt-4">
                    <div className="mb-2 text-xs font-semibold text-slate-500">演示账号（点击自动填充）</div>
                    <div className="flex gap-2">
                        {QUICK_ACCOUNTS.map((acc) => (
                            <button
                                key={acc.username}
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-xs hover:bg-slate-50"
                                onClick={() => fillQuick(acc.username, acc.password)}
                            >
                                {acc.label}
                                <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                                    {acc.username} / {acc.password}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}