import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-12 bg-white shadow flex items-center justify-between px-4">
      <h1 className="text-lg font-bold">管理系统</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.uname} ({user.urole})</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={logout}
          >
            退出
          </button>
        </div>
      )}
    </header>
  );
}
