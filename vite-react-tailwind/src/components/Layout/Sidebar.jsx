import { NavLink } from "react-router-dom";
import routes from "../../routes/routes";

const Sidebar = () => {

  return (
    <div className="h-screen w-60 bg-gray-900 text-white flex flex-col">
      {/* 顶部 Logo */}
      <div className="p-4 text-lg font-bold border-b border-gray-700">react+tailwindCSS</div>

      {/* 菜单列表 */}
      <div className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {routes.filter(v => v.path!=='*').map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-gray-700 text-white font-semibold"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* 底部版权 */}
      <div className="p-3 text-sm border-t border-gray-700 text-gray-400">
        © 2025 MyApp
      </div>
    </div>
  );
};

export default Sidebar;

