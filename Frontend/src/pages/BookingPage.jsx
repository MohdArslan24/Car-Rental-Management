import React, { use } from "react";
import { assets, dummyMyBookingsData } from "../assets/assets";
import Title from "../components/Title";
import { useState, useEffect } from "react";
const BookingPage = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    setBookings(dummyMyBookingsData);
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 max-w-7xl">
      <Title
        title={"My Bookings"}
        subTitle={"View and manage your car bookings"}
        align={"left"}
      />

      <div>
        {bookings.map((booking, index) => {
          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12" key={index}>
              <div className="col-span-1 md:col-span-1">
                <div className="rounded-md overflow-hidden mb-3">
                  <img
                    src={booking.car.image}
                    alt=""
                    className="w-full h-auto object-cover aspect-ratio"
                  />
                </div>
                <p className="text-lg font-medium mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.car.year} • {booking.car.category} •{" "}
                  {booking.car.location}
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <p className="bg-light rounded px-3 py-1.5">
                    Booking #{index + 1}
                  </p>
                  <p
                    className={`${
                      booking.status === "pending" &&
                      "bg-yellow-100 text-yellow-400"
                    } text-green-400 bg-green-100 px-3 py-1.5 rounded-full`}
                  >
                    {booking.status}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {booking.pickupDate.split("T")[0]} To{" "}
                      {booking.returnDate.split("T")[0]}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="w-5 h-5 mt-1 "
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking.car.location}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="w-5 h-5 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Return Location</p>
                    <p>{}</p>
                  </div>
                </div>

                
              </div>
              <div className="col-span-1 md:col-span-1 flex flex-col justify-between gap-6 ">
                  <div>
                    <p className="text-gray-500 text-sm">Total Price</p>
                    <h1 className="text-blue-600 text-2xl font-medium">{currency}{booking.price}</h1>
                    <p className="text-gray-500 text-sm">Booked on {booking.createdAt.split('T')[0]}</p>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingPage;
