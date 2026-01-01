import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <div className='flex items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-8'>
      <div className='flex flex-col md:flex-row md:items-center items-center justify-between gap-8 w-full bg-linear-to-r from-[#0558FE] to-[#A9CFFF] px-8 md:px-12 py-10 rounded-2xl overflow-hidden'>
      <div className='text-white'>
        <h2 className='text-3xl font-medium'>Do you own a luxury car</h2>
        <p className='mt-2'>Monetize your vehicle effortlessly by listing it on Car Rental.</p>
        <p className='max-w-150'>We take care of driver verification and secure payments so you can earn passive income stress free.</p>
        <button onClick={() => {navigate('/add-car')}} className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer '>List your car</button>
      </div>
      <img src={assets.banner_car_image} alt="banner_img" className='max-h-40 md:max-h-48 shrink-0' />
      </div>
    </div>
  )
}

export default Banner
