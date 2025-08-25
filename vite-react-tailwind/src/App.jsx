import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import Layout from "./components/Layout/Layout";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";

function App() {
  const { user } = useAuthStore();
  if(!user) {
    return <Login />
  }
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
