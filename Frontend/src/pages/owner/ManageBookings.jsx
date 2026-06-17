import React from 'react'
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useEffect, useState } from "react";
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const {axios, currency} = useAppContext()
  const [bookings,setBooking] = useState([])
    const fetchOwnerBookings = async () => {
     try{
      const {data} = await axios.get('/api/bookings/owner')
      data.success ? setBooking(data.bookings) : toast.error(data.message)
      console.log(bookings)
     }
     catch(err){
      toast.error(err.message)
     }
    }
    const changeBookingStatus = async (bookingId,status) => {
     try{
      const {data} = await axios.post('/api/bookings/change-status',{bookingId,status})
      if(data.success){
         toast.success(data.message)
         fetchOwnerBookings()
      }
      else{
         toast.error(data.message)
      }
     }
     catch(err){
      toast.error(err.message)
     }
    }
    // const handleStatusChange = (index, newStatus) => {
    //   const updatedBookings = [...bookings];
    //   updatedBookings[index].status = newStatus;
    //   setBooking(updatedBookings);
    // }
    useEffect(() => {
      fetchOwnerBookings();
    },[]);
  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title={"Manage Bookings"}
        subtitle={
          "Track all customer bookings, approve or cancel requests, and manage booking statuses"
        }
        align={'left'}
      />

      <div className="w-full max-w-3xl border border-borderColor rounded-lg p-1.5 my-8">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Car</th>
              <th className="px-4 py-2 font-medium max-md:hidden">Date Range</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium max-md:hidden">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {bookings.map((booking,index) => (
              booking.car ? (
                <tr key={index} className="border-t border-borderColor">
                  <td className="flex items-center p-3 gap-3">
                    <img src={booking.car.image} alt="" className="h-16 w-16 aspect-square rounded-md object-cover" />
                    <div className="max-md:hidden">
                      <p className="font-medium">{booking.car.brand} {booking.car.model}</p>
                      <p className="text-xs text-blue-600">{booking.car.vehicleNumber}</p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">{booking.pickupDate.split('T')[0]}</td>
                  <td className="p-3">{currency}{booking.totalPrice}</td>
                  <td className="p-3 max-md:hidden">{booking.status === "confirmed" ? <span className="bg-green-100 text-green-600 p-1 px-2 rounded-full text-xs font-medium">Confirmed</span> : booking.status === "completed" ? <span className="bg-blue-100 text-blue-600 p-1 px-2 rounded-full text-xs font-medium">Completed</span> : booking.status === "cancelled" ? <span className="bg-red-100 text-red-600 p-1 px-2 rounded-full text-xs font-medium">Cancelled</span> : <span className="bg-yellow-100 text-yellow-600 p-1 px-2 rounded-full text-xs font-medium">Pending</span>}</td>
                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select onChange={(e)=>{changeBookingStatus(booking._id,e.target.value); /*handleStatusChange(index, e.target.value) }*/}} name="" value={booking.status} id="" className="border border-gray-300 rounded-md p-1.5 text-xs cursor-pointer outline-none">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={index} className="border-t border-borderColor bg-gray-50">
                  <td className="flex items-center p-3 gap-3">
                    <div className="h-16 w-16 aspect-square rounded-md bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">N/A</span>
                    </div>
                    <div className="max-md:hidden">
                      <p className="font-medium text-gray-400">Car Deleted</p>
                      <p className="text-xs text-gray-500">Vehicle data unavailable</p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">{booking.pickupDate.split('T')[0]}</td>
                  <td className="p-3">{currency}{booking.totalPrice}</td>
                  <td className="p-3 max-md:hidden"><span className="bg-gray-200 text-gray-600 p-1 px-2 rounded-full text-xs font-medium">{booking.status}</span></td>
                  <td className="p-3"><span className="text-gray-400 text-xs">-</span></td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
