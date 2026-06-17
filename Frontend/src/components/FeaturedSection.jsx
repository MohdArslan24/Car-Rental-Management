import React, { use } from "react";
import Title from "./Title";
import { assets, dummyCarData } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
    const navigate = useNavigate();
    const {cars} = useAppContext()
  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div>
        <Title
          title={"Featured Vehicles"}
          subTitle={"Explore our premium vehicles"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {cars.slice(0, 6).map((car) => {
          return (
            <div key={car._id}>
              <CarCard car={car} />
            </div>
          );
        })}
      </div>
      <button onClick={() => {navigate('/cars'); window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}} className="flex items-center justify-center gap-2 mt-16 px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer">
        Explore all cars <img src={assets.arrow_icon} alt="arrow" className="color-white"/>
      </button>
    </div>
  );
};

export default FeaturedSection;
