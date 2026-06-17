import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "#ef4444" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#ef4444"
    className="w-7 h-7 drop-shadow bg-white rounded-full p-1 border border-gray-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.676 0-3.154.936-3.937 2.344C11.154 4.686 9.676 3.75 8 3.75 5.401 3.75 3.3 5.765 3.3 8.25c0 7.22 8.25 11.25 8.25 11.25s8.25-4.03 8.25-11.25z"
    />
  </svg>
);

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const { user, addToWishlist, removeFromWishlist, setShowLogin } = useAppContext();
  const isWishlisted = user?.wishlist?.some((id) => id === car._id || id?._id === car._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(car._id);
    } else {
      addToWishlist(car._id);
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`/cars/${car._id}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }}
      className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative"
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 z-10 cursor-pointer"
        onClick={handleWishlistClick}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon filled={isWishlisted} />
      </button>

      <img src={car.image} alt="" className="w-full h-48 object-cover" />
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold">{car.brand} {car.model}</h2>
          <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {car.year}
          </p>
        </div>

        {/* Owner Name */}
        {car.owner && (
          <p className="text-xs text-gray-500 mb-1 font-medium">Owner: {car.owner.name}</p>
        )}

        <p className="text-xs text-gray-500 mb-2">Vehicle No. : {car.vehicleNumber}</p>

        <div className="flex gap-2 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <img src={assets.fuel_icon} alt="" className="h-3" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <img src={assets.car_icon} alt="" className="h-3" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <img src={assets.users_icon} alt="" className="h-3" />
            {car.seating} Seats
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3">{car.location}</p>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-600">
            {currency}{car.dailyRate || car.pricePerDay || "N/A"}
            <span className="text-sm text-gray-500">/day</span>
          </p>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
