import React, { use } from 'react'
import { dummyUserData, ownerMenuLinks } from '../../assets/assets'
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
const Sidebar = () => {
    const {user, axios, fetchUser} = useAppContext() 
    const location = useLocation();
    const [image, setImage] = useState('');
    const updateImage = async () => {
        try{
          const formData = new FormData()
          formData.append('image',image)
          const {data} = await axios('/api/owner/update-profile-image', formData)
          if(data.success){
            fetchUser()
            toast.success(data.message)
            setImage(null)
          
          }
          else{
            toast.error(data.message)
          }
        }
        catch(err){
          toast.error(err.message)
        }
    }
  return (
    <div className='relative min-h-screen md:flex flex-col items-center mt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
      <div className='group relative'>
        <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : user?.image || ''} alt="" className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' />
            <input type="file" id="image" accept='image/*' hidden onChange={e => {setImage(e.target.files[0])}} />


                <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                    <p>Change Photo</p>  
            </div>
        </label>
      </div>
      {image && (
        <button onClick={updateImage} className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
            Upload</button>)}
            <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
            <div className='mt-8 w-full px-4 space-y-4'>
                {ownerMenuLinks.map((link, index) => {
                    return (
                        <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : "text-gray-600"}`}>
                            <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="" />
                            <span className='max-md:hidden'>{link.name}</span>
                            <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-lg absolute right-0`}></div>
                        </NavLink>
                    )
                })}
                </div>

    </div>
  )
}

export default Sidebar
