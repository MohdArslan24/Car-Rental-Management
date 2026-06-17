import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import BookingPage from './pages/BookingPage'
import Messages from './pages/Messages'
import Wishlist from './pages/Wishlist'
import Login from './components/Login'
import Layout from './pages/owner/Layout'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Dashboard from './pages/owner/Dashboard'
import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

function App() {
  const { showLogin, setShowLogin, fetchCars } = useAppContext()

  useEffect(() => {
    fetchCars()
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      {showLogin && <Login />}
      
      <Routes>
        {/* Customer Routes */}
        <Route path='/' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/cars' element={<><Navbar /><Cars /><Footer /></>} />
        <Route path='/cars/:id' element={<><Navbar /><CarDetails /><Footer /></>} />
        <Route path='/my-bookings' element={<><Navbar /><BookingPage /><Footer /></>} />
        <Route path='/my-inquiries' element={<><Navbar /><BookingPage /><Footer /></>} />
        <Route path='/wishlist' element={<><Navbar /><Wishlist /><Footer /></>} />
        <Route path='/messages' element={<><Navbar /><Messages /><Footer /></>} />

        {/* Owner Routes */}
        <Route path='/owner/*' element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
