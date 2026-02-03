import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';

export default function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen flex-1">
        <Topbar />
        <div className="px-6 py-4">
          <Breadcrumbs />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
