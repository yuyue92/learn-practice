import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";

/**
 * 本示例演示：
 * - 登录后保存 JWT + 用户角色/权限
 * - 页面级导航守卫（登录校验、角色校验、权限校验）
 * - 动态导航菜单（自动隐藏无权限的入口）
 * - 登录后跳回原目标页
 * - TailwindCSS 简单样式
 *
 * 依赖：react, react-dom, react-router-dom
 * 可选（真实项目）：axios（演示见文末注释）
 */

/*********************** 假数据 & API 模拟 *************************/
const fakeApi = {
  async login({ username, password }) {
    // 在真实项目里调用后端，例如 POST /api/login 获得 token 与用户信息
    // 这里根据用户名模拟三种身份：admin、manager、user
    await wait(500);
    const base = {
      id: Math.random().toString(36).slice(2, 8),
      name: username,
    };
    if (username === "admin") {
      return {
        token: "jwt.admin.mock",
        user: { ...base, roles: ["admin"], permissions: ["reports.read", "users.manage", "orders.read"] },
      };
    }
    if (username === "manager") {
      return {
        token: "jwt.manager.mock",
        user: { ...base, roles: ["manager"], permissions: ["reports.read", "orders.read"] },
      };
    }
    return {
      token: "jwt.user.mock",
      user: { ...base, roles: ["user"], permissions: ["orders.read"] },
    };
  },
  async me(token) {
    // 真实项目里用 token 向 /api/me 获取用户与权限
    await wait(300);
    if (!token) throw new Error("No token");
    // 简化：从 token 还原一个默认用户
    if (token.includes("admin")) return { id: "me", name: "admin", roles: ["admin"], permissions: ["reports.read", "users.manage", "orders.read"] };
    if (token.includes("manager")) return { id: "me", name: "manager", roles: ["manager"], permissions: ["reports.read", "orders.read"] };
    return { id: "me", name: "user", roles: ["user"], permissions: ["orders.read"] };
  },
};

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/*********************** Auth 上下文 *************************/
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [booting, setBooting] = useState(true); // 启动期（从本地/服务端拉取会话）

  useEffect(() => {
    (async () => {
      try {
        if (token && !user) {
          const u = await fakeApi.me(token);
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (e) {
        // token 失效
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setBooting(false);
      }
    })();
  }, []); // 仅首屏

  useEffect(() => {
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
  }, [user]);

  const login = async (payload) => {
    const { token: t, user: u } = await fakeApi.login(payload);
    setToken(t);
    setUser(u);
    return { token: t, user: u };
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token && !!user;

  const hasRole = (role) => !!user?.roles?.includes(role);
  const hasAnyRole = (roles = []) => roles.length === 0 || roles.some(r => hasRole(r));
  const hasPermission = (perm) => !!user?.permissions?.includes(perm);
  const hasAllPermissions = (perms = []) => perms.every(p => hasPermission(p));

  const value = useMemo(() => ({
    booting,
    token,
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
  }), [booting, token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() { return useContext(AuthContext); }

/*********************** 路由守卫（页面级） *************************/
/**
 * Guard 组件：
 * - requiresAuth: 是否需要登录
 * - anyRoles: 只要命中其中一个角色即可通过
 * - allPermissions: 需要全部权限都具备
 */
function Guard({ children, requiresAuth = false, anyRoles = [], allPermissions = [] }) {
  const { booting, isAuthenticated, hasAnyRole, hasAllPermissions } = useAuth();
  const location = useLocation();

  if (booting) return <FullScreenLoading />;

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiresAuth && anyRoles.length > 0 && !hasAnyRole(anyRoles)) {
    return <Navigate to="/403" replace />;
  }

  if (requiresAuth && allPermissions.length > 0 && !hasAllPermissions(allPermissions)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

/*********************** 导航栏（自动隐藏无权限菜单） *************************/
const NAV_ITEMS = [
  { to: "/", label: "仪表盘", requiresAuth: true },
  { to: "/orders", label: "订单", requiresAuth: true, allPermissions: ["orders.read"] },
  { to: "/reports", label: "报表", requiresAuth: true, allPermissions: ["reports.read"] },
  { to: "/admin", label: "用户管理", requiresAuth: true, anyRoles: ["admin"] },
];

function AppNav() {
  const { isAuthenticated, hasAnyRole, hasAllPermissions, user, logout } = useAuth();

  const visible = useMemo(() => {
    return NAV_ITEMS.filter(item => {
      if (item.requiresAuth && !isAuthenticated) return false;
      if (item.anyRoles && item.anyRoles.length && !hasAnyRole(item.anyRoles)) return false;
      if (item.allPermissions && item.allPermissions.length && !hasAllPermissions(item.allPermissions)) return false;
      return true;
    });
  }, [isAuthenticated, hasAnyRole, hasAllPermissions]);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold">RBAC Demo</span>
          <nav className="hidden md:flex items-center gap-2">
            {visible.map(v => (
              <Link key={v.to} to={v.to} className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm">
                {v.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.name}（{user?.roles?.join(",")}）</span>
              <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm">退出</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}

/*********************** 页面 *************************/
function Layout({ children }) {
  return (
    <div className="h-screen bg-gray-50 grid grid-rows-[auto,1fr] overflow-hidden">
      <AppNav />
      <main className="min-h-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}


function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">仪表盘</h1>
      <p className="text-gray-600">欢迎，{user?.name}！</p>
    </div>
  );
}

function Orders() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">订单列表</h1>
      <p className="text-gray-600">需要权限：orders.read</p>
    </div>
  );
}

function Reports() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">数据报表</h1>
      <p className="text-gray-600">需要权限：reports.read</p>
    </div>
  );
}

function AdminUsers() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">用户管理</h1>
      <p className="text-gray-600">仅 admin 角色可见</p>
    </div>
  );
}

function Forbidden() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">403 Forbidden</h1>
      <p className="text-gray-600">您没有访问此页面的权限。</p>
      <div className="mt-6"><Link to="/" className="px-4 py-2 rounded bg-gray-900 text-white">返回首页</Link></div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">404 Not Found</h1>
      <p className="text-gray-600">页面不存在。</p>
      <div className="mt-6"><Link to="/" className="px-4 py-2 rounded bg-gray-900 text-white">返回首页</Link></div>
    </div>
  );
}

function FullScreenLoading() {
  return (
    <div className="grid place-items-center min-h-[50vh]"><div className="animate-pulse text-gray-500">加载中…</div></div>
  );
}

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (e) {
      setError("登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">登录</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="用户名：admin / manager / user"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="密码（任意）"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={loading} className="w-full rounded-lg bg-gray-900 text-white py-2">
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">登录后会根据角色/权限自动控制路由与菜单。</p>
      </div>
    </div>
  );
}

/*********************** 路由表（含 meta） *************************/
const ROUTES = [
  { path: "/", element: <Dashboard />, meta: { requiresAuth: true } },
  { path: "/orders", element: <Orders />, meta: { requiresAuth: true, allPermissions: ["orders.read"] } },
  { path: "/reports", element: <Reports />, meta: { requiresAuth: true, allPermissions: ["reports.read"] } },
  { path: "/admin", element: <AdminUsers />, meta: { requiresAuth: true, anyRoles: ["admin"] } },
];

function RouteWithGuard({ element, meta }) {
  return (
    <Guard {...(meta || {})}>
      {element}
    </Guard>
  );
}

/*********************** 入口 App *************************/
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {ROUTES.map(r => (
              <Route key={r.path} path={r.path} element={<RouteWithGuard {...r} />} />
            ))}
            <Route path="/login" element={<Login />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

/*********************** 可选：axios 拦截器（在真实项目中启用） *************************/
/**
 * import axios from 'axios';
 * import { useEffect } from 'react';
 *
 * function useAxiosAuth(token, logout) {
 *   useEffect(() => {
 *     const ins = axios.create({ baseURL: '/api' });
 *     ins.interceptors.request.use(cfg => {
 *       if (token) cfg.headers.Authorization = `Bearer ${token}`;
 *       return cfg;
 *     });
 *     ins.interceptors.response.use(
 *       resp => resp,
 *       err => {
 *         const status = err?.response?.status;
 *         if (status === 401) logout(); // token 失效，登出
 *         if (status === 403) window.location.assign('/403');
 *         return Promise.reject(err);
 *       }
 *     );
 *     return () => { ins.interceptors.request.handlers = []; ins.interceptors.response.handlers = []; };
 *   }, [token, logout]);
 * }
 */
