import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { assets } from "../assets/assets";
import Loader from "../components/Loader.jsx";
import Footer from "../components/Footer.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const CarDetails = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, user, setShowLogin, createOrGetChat, setCurrentConversation } = useAppContext();
  const [car, setCar] = React.useState(null);
  const [owner, setOwner] = React.useState(null);

  useEffect(() => {
    const foundCar = cars.find((car) => car._id === id);
    if (foundCar) {
      setCar(foundCar);
      // In a real app, you'd fetch owner details from the API
      // For now, we'll just use basic info
    }
  }, [id, cars]);



  return car ? (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700"
        >
          <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65 h-5" />
          Back to all cars
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images & Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-auto md:max-h-96 object-cover rounded-xl mb-6 shadow-md"
            />

            {/* Car Title & Basics */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">
                {car.brand} {car.model}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="text-lg">{car.year}</span>
                <span className="text-lg">•</span>
                <span className="text-lg">{car.category}</span>
                <span className="text-lg">•</span>
                <span className="text-lg">{car.location}</span>
              </div>
              <p className="text-sm text-blue-600 font-semibold mt-2 bg-blue-50 p-2 rounded inline-block">
                Vehicle: {car.vehicleNumber}
              </p>
            </div>

            {/* Car Specifications */}
            <h2 className="text-2xl font-semibold mb-4">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: assets.users_icon, text: `${car.seating || car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuelType || car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <img src={icon} alt="" className="h-6 mb-2" />
                  <p className="text-sm text-center font-medium">{text}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">About this car</h3>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Air Conditioning",
                  "Power Windows",
                  "Bluetooth Connectivity",
                  "Backup Camera",
                  "Power Steering",
                  "Airbags",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-600">
                    <img src={assets.check_icon} alt="" className="h-5 mr-3 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar: Owner Info & Contact */}
          <div className="lg:col-span-1">
            {/* Daily Rate Card */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md mb-6 border border-blue-200">
              <p className="text-gray-600 text-sm mb-2">Daily Rate</p>
              <p className="text-4xl font-bold text-blue-700">
                {currency}{car.dailyRate || car.pricePerDay}
              </p>
              <p className="text-gray-600 text-sm mt-1">per day • Negotiable</p>
            </div>

            {/* Owner Card */}
            {car.owner && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Car Owner</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  {car.owner.image ? (
                    <img
                      src={car.owner.image}
                      alt={car.owner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {car.owner.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{car.owner.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {car.owner.rating ? (
                        <>
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {car.owner.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">(Verified)</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">New Owner</span>
                      )}
                    </div>
                  </div>
                </div>

                {car.owner.phone && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Phone:</span> {car.owner.phone}
                  </p>
                )}

                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4">
                  ✓ Verified car owner with proven rental experience
                </p>

                <button
                  onClick={async () => {
                    if (!user) {
                      setShowLogin(true);
                      return;
                    }
                    const chat = await createOrGetChat(car._id);
                    if (chat) {
                      setCurrentConversation(chat);
                      navigate(`/messages?conversation=${chat._id}`);
                    }
                  }}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all mb-3"
                >
                  Chat with Owner
                </button>
                <button
                  onClick={() => navigate("/cars")}
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  ← Browse More Cars
                </button>
              </div>
            )}

            {/* How it Works */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">How it works</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">1</span>
                  <p>Contact the car owner through our chat</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">2</span>
                  <p>Discuss rental dates and terms</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">3</span>
                  <p>Arrange a meet-up to finalize details</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-blue-600 shrink-0">4</span>
                  <p>Enjoy your rental!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </>
  ) : (
    <Loader />
  );
};

export default CarDetails;
