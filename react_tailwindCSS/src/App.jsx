import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import TableList from './pages/TableList'
import Home from './pages/Home'

export default function App() {
  const linkBase =
    'px-3 py-2 rounded-md text-sm font-medium transition-colors'
  const linkClass = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-gray-900 text-white`
      : `${linkBase} text-gray-700 hover:bg-gray-100`

  return (
    <BrowserRouter>
      {/* 整体竖向布局：头部 + 主内容；主内容单独滚动 */}
      <div className="h-screen flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <header className="h-14 border-b bg-white">
          <div className="h-full max-w-6xl mx-auto flex items-center justify-between px-4">
            <div className="font-semibold">My App</div>
            <nav className="flex items-center gap-2">
              <NavLink to="/" end className={linkClass}>Home</NavLink>
              <NavLink to="/table" className={linkClass}>TableList</NavLink>
            </nav>
          </div>
        </header>

        {/* 主内容：flex-1 + overflow-auto + min-h-0 让内部滚动生效 */}
        <main className="flex-1 overflow-auto min-h-0 bg-gray-100">
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/table" element={
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-2xl font-semibold mb-4">TableList</h1>
                  <TableList />
                </div>
              } />
              <Route path="*" element={
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-xl font-semibold">404 Not Found</h1>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}
