import React from 'react'
import { Outlet } from 'react-router-dom'
import OwnerNavbar from '../../components/owner/OwnerNavbar.jsx'
import Sidebar from '../../components/owner/Sidebar.jsx'

const Layout = () => {
  return (
    <div className='flex flex-col'>
      <OwnerNavbar />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
