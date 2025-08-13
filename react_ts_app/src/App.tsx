import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UsersList from './pages/UsersList'
import UserDetail from './pages/UserDetail'
import ProductsList from './pages/ProductsList'
import ProductDetail from './pages/ProductDetail'
import UsersPage from './pages/UsersPage'
import ImageUpload from './pages/ImageUpload'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="usersPage" element={<UsersPage />} />
        <Route path="imageUpload" element={<ImageUpload />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
