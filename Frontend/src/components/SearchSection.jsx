import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Validation
    if (!searchData.location) {
      toast.error("Please select a location");
      return;
    }
    if (!searchData.pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }
    if (!searchData.returnDate) {
      toast.error("Please select a return date");
      return;
    }

    const pickupDate = new Date(searchData.pickupDate);
    const returnDate = new Date(searchData.returnDate);

    if (returnDate <= pickupDate) {
      toast.error("Return date must be after pickup date");
      return;
    }

    // Navigate to Cars page with search criteria
    navigate("/cars", {
      state: {
        searchCriteria: searchData,
      },
    });
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-8">
          Find Your Perfect Car
        </h2>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg shadow-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Location Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <select
                name="location"
                value={searchData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">Select Location</option><option value="Bareilly">Bareilly</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            {/* Pickup Date Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={searchData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Return Date Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={searchData.returnDate}
                onChange={handleChange}
                min={searchData.pickupDate || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-80 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Search Cars
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;
