import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../components/Loader.jsx";
import Footer from "../components/Footer.jsx";

const CarDetails = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Booking functionality is not implemented yet.");
  }

  useEffect(() => {
    setCar(dummyCarData.find((car) => car._id === id));
  }, [id]);
  return car ? (
    <>
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center gap-2 mb-6 text-gray-500"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="lg:cols-span-2">
          <img
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
        </div>
        <form onSubmit={handleSubmit} className="h-max sticky top-18 bg-light p-6 rounded-xl shadow-md space-y-4 teaxt-gray-600">
            <p className="text-2xl text-gray-800 font-semibold">{`${currency}${car.pricePerDay}`}<span className="ml-1 text-gray-500 text-base font-medium"> per day</span></p>
            <hr className="border border-borderColor my-6"/>
            <div className="flex flex-col justify-center gap-4">
                <label htmlFor="pickup-date">Pickup Date</label>
                <input type="date" className="border border-borderColor rounded-lg px-3 py-2" required id="pickup-date" min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div className="flex flex-col justify-center gap-4 mt-5">
                <label htmlFor="return-date">Return Date</label>
                <input type="date" className="border border-borderColor rounded-lg px-3 py-2" required id="return-date" min={new Date().toISOString().split('T')[0]}/>
            </div>
            <button className="text-white font-normal hover:bg-blue-500 bg-blue-600 py-2 px-3 rounded-lg mt-4 cursor-pointer transition-all">Book Now</button>
        </form>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">BMW M4 COMPETITION</h1>
          <p className="text-lg text-gray-300">
            {car.category} • {car.model}
          </p>
        </div>
        <hr className="border-borderColor my-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
            { icon: assets.fuel_icon, text: car.fuel_type },
            { icon: assets.car_icon, text: car.transmission },
            { icon: assets.location_icon, text: car.location },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center bg-light p-4 rounded-lg"
            >
              <img src={icon} alt="" className="h-5 mb-2" />
              {text}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h1 className="text-xl font-medium mb-3">Description</h1>
          <p className="text-gray-500">{car.description}</p>
        </div>
        <div className="my-8">
          <h1 className="text-xl font-medium mb-3">Features</h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Air Conditioning",
              "Leather Seats",
              "Bluetooth Connectivity",
              "Backup Camera",
            ].map((item) => {
              return <li key={item} className="flex items-center text-gray-500">
                <img src={assets.check_icon} alt="" className="h-4 mr-2" />
                {item}
              </li>;
            })}
          </ul>
        </div>
      </div>

      </>
    
  ) : (
    <Loader />
  );
};

export default CarDetails;
