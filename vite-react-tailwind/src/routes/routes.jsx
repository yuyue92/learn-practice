import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Users from "../pages/UsersPage.jsx";
import Orders from "../pages/OrdersPage.jsx";
import NotFound from "../pages/NotFound.jsx";

const routes = [
  { path: "/", element: <Home />, label: "首页" },
  { path: "/login", element: <Login />, label: "登录" },
  { path: "/users", element: <Users />, label: "用户管理" },
  { path: "/orders", element: <Orders />, label: "订单管理" },
  { path: "*", element: <NotFound />, label: "404" },
];

export default routes;
