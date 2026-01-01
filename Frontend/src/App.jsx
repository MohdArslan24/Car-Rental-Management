import { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation , Routes , Route } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import BookingPage from './pages/BookingPage';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout.jsx';
import Dashboard from './pages/owner/Dashboard.jsx';
import AddCar from './pages/owner/AddCar.jsx';
import ManageCars from './pages/owner/ManageCars.jsx';
import ManageBookings from './pages/owner/ManageBookings.jsx';
import Login from './components/Login.jsx';
function App() {
  const [showLogin, setShowLogin] = useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    {showLogin && <Login setShowLogin={setShowLogin}/>}
    {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/car-details/:id' element={<CarDetails />} />
      <Route path='/cars' element={<Cars />} />
      <Route path='/my-bookings' element={<BookingPage />} />
      <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='add-car' element={<AddCar />} />
        <Route path='manage-cars' element={<ManageCars />} />
        <Route path='manage-bookings' element={<ManageBookings />} />
      </Route>
    </Routes>
      
      {!isOwnerPath && <Footer />}
    </>
    
  )
  
}

export default App
