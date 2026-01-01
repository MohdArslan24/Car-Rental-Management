import React from 'react'
import Title from "../../components/owner/Title";
import { assets, dummyMyBookingsData } from "../../assets/assets";
import { useEffect, useState } from "react";

const ManageBookings = () => {
 const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [bookings,setBooking] = useState([])
    const fetchOwnerBookings = async () => {
      setBooking(dummyMyBookingsData)
    }
    const handleStatusChange = (index, newStatus) => {
      const updatedBookings = [...bookings];
      updatedBookings[index].status = newStatus;
      setBooking(updatedBookings);
    }
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
            {bookings.map((booking,index) => {
              return (
                <tr key={index} className="border-t border-borderColor ">
                  <td className="flex items-center p-3 gap-3">
                    <img src={booking.car.image} alt="" className="h-16 w-16 aspect-square rounded-md object-cover" />
                    <div className="max-md:hidden">
                      <p className="font-medium">{booking.car.brand} {booking.car.model}</p>
                    
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">{booking.pickupDate.split('T')[0]}  To  {booking.returnDate.split('T')[0]}</td>
                  <td className="p-3 max-md:hidden">{currency}{booking.price}/day</td>
                  <td className="p-3 max-md:hidden">{booking.status === "confirmed" ? <span className="bg-green-100 p-2 text-green-500 rounded-full">Confirmed</span> : (booking.status === "completed") ? <span className="bg-blue-100 p-2 text-blue-500 rounded-full">Completed</span> : (booking.status === "cancelled") ? <span className="bg-red-100 p-2 text-red-500 rounded-full">Cancelled</span> : <span className="bg-yellow-100 p-2 text-yellow-500 rounded-full">Pending</span>}</td>
                  <td className="p-3 max-md:hidden">
                    {booking.status === "pending" ? (
                      <select name="" value={booking.status} id="" className="border border-gray-300 rounded-md p-2 cursor-pointer outline-none" onChange={(e) => handleStatusChange(index, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    ) : (
                      <span>
                        No Actions Available
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
