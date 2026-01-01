import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets, dummyCarData } from "../../assets/assets";

const ManageCars = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [car,setCar] = useState([])
  const fetchOwnerCars = async () => {
    setCar(dummyCarData)
  }
  useEffect(() => {
    fetchOwnerCars();
  },[]);
  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title={"Manage Cars"}
        subtitle={
          "View all listed cars, update their details, or remove them from the booking platform."
        }
        align={'left'}
      />

      <div className="w-full max-w-3xl border border-borderColor rounded-lg p-1.5 my-8">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Car</th>
              <th className="px-4 py-2 font-medium max-md:hidden">Category</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium max-md:hidden">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {car.map((car,index) => {
              return (
                <tr key={index} className="border-t border-borderColor">
                  <td className="flex items-center p-3 gap-3">
                    <img src={car.image} alt="" className="h-16 w-16 aspect-square rounded-md object-cover" />
                    <div className="max-md:hidden">
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-xs text-gray-500">{car.seating_capacity} seats • {car.transmission}</p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">{car.category}</td>
                  <td className="p-3 max-md:hidden">{currency}{car.pricePerDay}/day</td>
                  <td className="p-3 max-md:hidden">{car.isAvaliable ? <span className="bg-green-100 p-2 text-green-500 rounded-full">Available</span> : <span className="bg-red-100 p-2 text-red-500 rounded-full">Not available</span>}</td>
                  <td className="p-3 max-md:hidden">
                    <button className="cursor-pointer mr-4">
                      {car.isAvaliable ? <img src={assets.eye_icon} alt="" /> : <img src={assets.eye_close_icon} alt="" />}
                    </button>
                    <button className="cursor-pointer mr-4">
                      <img src={assets.delete_icon} alt="" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
