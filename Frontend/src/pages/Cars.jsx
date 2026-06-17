import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import Footer from '../components/Footer.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import Loader from '../components/Loader.jsx'
import { useLocation } from 'react-router-dom'
import SearchResults from '../components/SearchResults.jsx'

const Cars = () => {
  const [input, setInput] = useState('')
  const { cars, fetchCars, loading } = useAppContext()
  const location = useLocation()
  const [searchCriteria, setSearchCriteria] = useState(null)

  useEffect(() => {
    // Check if navigation came with search criteria
    if (location.state?.searchCriteria) {
      setSearchCriteria(location.state.searchCriteria)
    }
    fetchCars()
  }, [location])

  // If search criteria exists, show search results instead
  if (searchCriteria) {
    return (
      <>
        <SearchResults 
          searchCriteria={searchCriteria} 
          onClearSearch={() => setSearchCriteria(null)}
        />
      </>
    )
  }

  const filteredCars = cars.filter(car => {
    const searchTerm = input.toLowerCase()
    return (
      car.brand?.toLowerCase().includes(searchTerm) ||
      car.model?.toLowerCase().includes(searchTerm) ||
      car.category?.toLowerCase().includes(searchTerm) ||
      car.type?.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <>
      <div>
        <div className='flex flex-col items-center bg-light py-20 max-md:px-4'>
          <Title title={"Find Your Perfect Car"} subTitle={"Search from our wide range of vehicles"} align={"center"}/>

          <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
            <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
            <input 
              type="text" 
              onChange={(e) => {setInput(e.target.value)}} 
              value={input} 
              placeholder='search by make, model or features' 
              className='w-full h-full outline-none text-gray-500' 
            />
            <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
          </div>
        </div>
        
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
          {loading ? (
            <Loader />
          ) : filteredCars.length > 0 ? (
            <>
              <p className='text-gray-600 mb-4'>Found {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}</p>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-16 max-w-7xl'>
                {filteredCars.map((car) => {
                  return (
                    <div key={car._id}>
                      <CarCard car={car} />
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No cars found matching your search</p>
            </div>
          )}
        </div>
      </div>

    </>
  )
}

export default Cars
