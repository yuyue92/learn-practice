import { redirect } from 'next/navigation';
import { NAV_ITEMS } from '../types/navigation';
import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you would check authentication here
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    redirect('/login');
  }

  const protectedItems = NAV_ITEMS.filter((item) => item.requiresAuth);

  return (
    <div className="flex min-h-screen">
      <Sidebar items={protectedItems} />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}