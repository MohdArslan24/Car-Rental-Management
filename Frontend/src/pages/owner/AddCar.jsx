import React, { useState } from 'react'
import Title from "../../components/owner/Title";
import { assets } from '../../assets/assets';
const AddCar = () => {
  const [image,setImage] = useState(null)
  const [car,setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    transmission: '',
    category: '',
    fuelType: '',
    seatingCapacity: 0,
    location: '',
    description: '',
  })
  const handleOnSubmit = async (e) => {
    e.preventDefault()
  }
  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
              title={"Add Car"}
              subtitle={
                "Fill in details to list a new car for booking, including pricing, availability, and car specifications."
              }
            />
            <form onSubmit={handleOnSubmit}>
            <div className='my-8'>
              <label htmlFor="car-image" className="border bg-white rounded-md text-sm w-80 border-indigo-600/60 p-8 flex flex-col items-center gap-4  cursor-pointer hover:border-indigo-500 transition">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {image ? <p className="text-sm text-green-600">Image Selected: {image.name}</p> : <p className="text-gray-500 text-lg">Upload a picture of your car</p>}
            
            
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" />
            <input id="car-image" type="file" hidden onChange={(e) => {
              setImage(e.target.files[0])
            }} />
        </label>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <label className="text-black/70" htmlFor="name">Brand
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='e.g. Mercedez,BMW,Audi..' required value={car.brand} onChange={(e) => {
                      setCar({...car,brand:e.target.value})
                    }} />
                    </label>
                    <label className="text-black/70" htmlFor="name">Model
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='e.g. X5,E-class,M-4..' required value={car.model} onChange={(e) => {
                      setCar({...car,model: e.target.value})
                    }} />
                    </label>
            </div>
            <div className='flex gap-6 my-5'>
              <label className="text-black/70" htmlFor="name">Year
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='2025' required value={car.year} onChange={(e) => {
                      setCar({...car,year: e.target.value})
                    }} />
                    </label>
                    <label className="text-black/70" htmlFor="name">Daily Price(₹)
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='1000' required value={car.pricePerDay} onChange={(e) => {
                      setCar({...car,pricePerDay: e.target.value})
                    }} />
                    </label>
                    <label className="text-black/70" htmlFor="name">Category
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='Sedan' required value={car.category} onChange={(e) => {
                      setCar({...car,category: e.target.value})
                    }} />
                    </label>
            </div>
            <div className='flex flex-wrap gap-6 my-5'>
              <label className="text-black/70" htmlFor="name">Transmission
                    <select className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 cursor-pointer" type="text" placeholder='Automatic' required value={car.transmission} onChange={(e) => {
                      setCar({...car,transmission: e.target.value})
                    }} >
                      <option value="">Select Transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="Semi-automatic">Semi-Automatic</option>
                      </select>
                    </label>
                    <label className="text-black/70" htmlFor="name">Fuel Type
                    <select className="h-12 px-3 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300 cursor-pointer" type="text" placeholder='Diesel' required value={car.fuelType} onChange={(e) => {
                      setCar({...car,fuelType: e.target.value})
                    }} >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Gas">Gas</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    </label>
                    <label className="text-black/70" htmlFor="name">Seating Capacity
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='5' required value={car.seatingCapacity} onChange={(e) => {
                      setCar({...car,seatingCapacity: e.target.value})
                    }}  />
                    </label>
                    <div className='flex flex-col gap-3 items-start'>
                    <label className="text-black/70" htmlFor="name">Location
                    <input className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300" type="text" placeholder='e.g. Delhi,Mumbai' required value={car.location} onChange={(e) => {
                      setCar({...car,location: e.target.value})
                    }}  />
                    </label>
                    <label className="text-black/70 w-87.5 md:w-175" htmlFor="name">Description
                <textarea className="w-full mt-2 p-3 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300" placeholder='Describe your car, its condition, and any notable details...' required value={car.description} onChange={(e) => {
                  setCar({...car,description: e.target.value})
                }}></textarea>
                </label>
                <button className='bg-primary text-white font-normal px-7 py-2 rounded-lg cursor-pointer'>List Car</button>
                </div>
                
            </div>
            </form>
    </div>
  )
}

export default AddCar
