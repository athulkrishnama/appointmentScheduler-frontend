import React from 'react';
import { Outlet } from 'react-router';
import Header from '../header/Header';

function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
