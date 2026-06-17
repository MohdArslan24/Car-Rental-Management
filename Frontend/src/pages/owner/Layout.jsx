import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import OwnerNavbar from '../../components/owner/OwnerNavbar.jsx'
import Sidebar from '../../components/owner/Sidebar.jsx'
import { useAppContext } from '../../context/AppContext.jsx'

const Layout = () => {
  const {isOwner, navigate} = useAppContext()
  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
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
