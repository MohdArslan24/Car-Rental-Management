import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, currency, axios } = useAppContext();
  const [car, setCar] = useState([]);
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/manage-cars");
      if (data.success) {
        setCar(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const toggleCarAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car-availability", {
        carId,
      });
      if (data.success) {
        // Update state immediately instead of refetching
        setCar(prevCars => 
          prevCars.map(c => 
            c._id === carId ? {...c, isAvailable: !c.isAvailable} : c
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };
  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm("Are you sure to remove this car");
      if (!confirm) return null;
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      fetchOwnerCars();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);
  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title={"Manage Cars"}
        subtitle={
          "View all listed cars, update their details, or remove them from the booking platform."
        }
        align={"left"}
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
            {car.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="flex items-center p-3 gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-16 w-16 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">{car.brand} {car.model}</p>
                    <p className="text-xs text-blue-600">{car.vehicleNumber}</p>
                    <p className="text-xs text-gray-500">
                      {car.seating} seats • {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">{currency}{car.dailyRate}/day</td>
                <td className="p-3 max-md:hidden">
                  {car.isAvailable ? 
                    <span className="bg-green-100 text-green-600 p-1 px-2 rounded-full text-xs font-medium">Available</span>
                    : 
                    <span className="bg-red-100 text-red-600 p-1 px-2 rounded-full text-xs font-medium">Not available</span>
                  }
                </td>
                <td className="p-3">
                  <select onChange={(e)=>{
                    if(e.target.value === "toggle") {
                      toggleCarAvailability(car._id);
                    } else if(e.target.value === "delete") {
                      deleteCar(car._id);
                    }
                    e.target.value = "";
                  }} defaultValue="" className="border border-gray-300 rounded-md p-1.5 text-xs cursor-pointer outline-none">
                    <option value="">Actions</option>
                    <option value="toggle">Toggle Availability</option>
                    <option value="delete">Delete Car</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
