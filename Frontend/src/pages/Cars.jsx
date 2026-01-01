import React, { use } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import { useState } from 'react'
import CarCard from '../components/CarCard'
import Footer from '../components/Footer.jsx'
const CarSearch = () => {
  const [input,setInput] = useState('')
  return (
    <>
    <div>
      <div className='flex flex-col items-center bg-light py-20 max-md:px-4'>
        <Title title={"Find Your Perfect Car"} subTitle={"Search from our wide range of vehicles"} align={"center"}/>

        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
          <input type="text" onChange={(e) => {setInput(e.target.value)}} value={input} placeholder='search by make, model or features' className='w-full h-full outline-none text-gray-500' />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </div>
      </div>
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-16 xl:px-20 max-w-7xl max-auto'>
          {dummyCarData.map((car,index) => {
            return (
              <div key={index}>
                <CarCard car={car} />
              </div>
            )
          })}
      </div>
    </div>
    </div>

    </>
  )
}

export default CarSearch
