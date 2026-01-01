import React from "react";
import { assets, dummyDashboardData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });
  const dashboardCars = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Completed",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];
  useEffect(() => {
    setData(dummyDashboardData);
  }, []);
  return (
    <div className="px-4 pt-10 md:px-10 flex-1 ">
      <Title
        title={"Admin Dashboard"}
        subtitle={
          "Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCars.map((card, index) => (
          <div className="flex gap-1 items-center justify-between p-4 rounded-lg border border-borderColor">
            <div className="flex flex-col gap-2 ">
              <h1 className="text-gray-500">{card.title}</h1>
              <p className="text-3xl font-medium">{card.value}</p>
            </div>
            <div className="bg-blue-200 border border-none rounded-full p-1.5">
              <img src={card.icon} alt={card.title} className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        <div className="p-4 md:p-6 w-full max-w-lg border border-borderColor rounded-md">
          <h1 className="font-medium text-xl">Recent Bookings</h1>
          <p className="text-gray-500 my-1.5">Latest customer bookings</p>
          { 
            (
              data.recentBookings.map((booking , index) => (
              <div className="flex items-center justify-between mt-3 p-3 border border-borderColor rounded-md">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 border border-none rounded-full p-1.5">
              <img src={assets.listIconColored} alt="" />
            </div>
            <div className="flex flex-col">
              <h2>{booking.car.brand} {booking.car.model}</h2>
              <p className="text-gray-500 text-sm">{booking.car.createdAt.split('T')[0]}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-gray-500 text-lg">{currency}{booking.price}</p>
            <p className="border border-borderColor rounded-2xl px-1.5 py-1">{booking.status}</p>
          </div>
        </div>
            ))
            )  
          }
        </div>
        
        <div className="p-4 md:p-6  max-w-lg border border-borderColor rounded-md">
          <div>
            <h1 className="font-medium text-xl">Monthly Revenue</h1>
            <p className="text-gray-500 my-1.5">Revenue for current month</p>
          </div>
          <h1 className="mt-4 text-4xl text-primary font-medium">{currency}{data.monthlyRevenue}</h1>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
