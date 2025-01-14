import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../sidebar/Sidebar';

function Layout() {
  return (
    <div className='flex'>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Layout
