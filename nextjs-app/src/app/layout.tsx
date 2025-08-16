import "./global.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // 新增侧边栏组件

export const metadata: Metadata = {
  title: "Next.js Routing Demo",
  description: "Demo of routing and menu in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        {/* 顶部状态条 */}
        <Navbar/>

        {/* 主体内容：左侧菜单 + 右侧内容 */}
        <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* 左侧菜单 */}
          <Sidebar/>
          {/* 右侧内容 */}
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}