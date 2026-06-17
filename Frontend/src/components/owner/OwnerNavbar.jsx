import React from 'react'
import { Link } from 'react-router-dom';
import {assets} from '../../assets/assets';
import { dummyUserData } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
 
const OwnerNavbar = () => {
  const {user} = useAppContext()
    
  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor  transition-all sticky top-0 bg-white z-10'>
      <Link to={'/'}>
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>
      <p><span className='text-2xl'>Welcome</span>, {user?.name || 'Owner'}</p>
    </div>
  )
}

export default OwnerNavbar
