import React from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isOwner, axios, currency, user } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { 
      title: "Total Cars", 
      value: data.totalCars, 
      icon: assets.carIconColored,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: "Completed",
      value: data.completedBookings,
      icon: assets.listIconColored,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching dashboard data...");
      
      const response = await axios.get("/api/owner/dashboard");
      console.log("Dashboard response:", response.data);
      
      if (response.data.success) {
        setData(response.data.dashboardData);
        console.log("Dashboard data set:", response.data.dashboardData);
      } else {
        setError(response.data.message || "Failed to fetch dashboard data");
        toast.error(response.data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error fetching dashboard";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("isOwner:", isOwner, "user:", user);
    if (isOwner && user) {
      fetchDashboardData();
    } else if (!isOwner) {
      setLoading(false);
      setError("You are not authorized as an owner");
    }
  }, [isOwner, user]);

  if (loading) {
    return (
      <div className="px-4 pt-10 md:px-10 flex-1">
        <Title
          title={"Dashboard"}
          subtitle={"Loading your dashboard..."}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 pt-10 md:px-10 flex-1">
        <Title
          title={"Dashboard"}
          subtitle={"There was an error loading your dashboard"}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-red-50 p-6 rounded-lg">
            <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title={"Owner Dashboard"}
        subtitle={
          "Monitor your cars, bookings, revenue, and recent activities"
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-between p-4 rounded-lg border border-gray-300 bg-white hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-black">{card.value}</p>
            </div>
            <div className={`${card.bgColor} rounded-full p-3 flex-shrink-0`}>
              {card.icon ? (
                <img src={card.icon} alt={card.title} className="h-6 w-6" />
              ) : (
                <div className={`h-6 w-6 rounded-full ${card.textColor}`}></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 p-6 border border-gray-300 rounded-lg bg-white">
          <h2 className="font-semibold text-lg text-black mb-2">Recent Bookings</h2>
          <p className="text-gray-500 text-sm mb-4">Latest customer bookings</p>
          
          {data.recentBookings && data.recentBookings.length > 0 ? (
            <div className="space-y-3">
              {data.recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {booking.car ? (
                      <>
                        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                          {assets.listIconColored ? (
                            <img src={assets.listIconColored} alt="booking" className="h-5 w-5" />
                          ) : (
                            <div className="h-5 w-5 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-black truncate">
                            {booking.car.brand} {booking.car.model}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.pickupDate ? booking.pickupDate.split('T')[0] : 'N/A'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                          <div className="h-5 w-5 bg-gray-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-400">Car Deleted</p>
                          <p className="text-xs text-gray-500">Car unavailable</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                    <p className="font-semibold text-black">
                      {currency}{booking.totalPrice || booking.price || 0}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="p-6 border border-gray-300 rounded-lg bg-white">
          <h2 className="font-semibold text-lg text-black mb-2">Monthly Revenue</h2>
          <p className="text-gray-500 text-sm mb-4">Current month earnings</p>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-4xl font-bold mt-2">{currency}{data.monthlyRevenue || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
