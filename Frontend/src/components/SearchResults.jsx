import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import CarCard from "./CarCard";
import toast from "react-hot-toast";
import "./SearchResults.css";

const SearchResults = ({ searchCriteria, onClearSearch }) => {
  const { axios } = useAppContext();
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [0, 20000],
    carType: [],
    transmission: [],
    fuelType: [],
    seating: "",
    rating: 0,
    availability: false,
  });

  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const fetchFilteredCars = async () => {
      if (!searchCriteria) return;

      try {
        setLoading(true);
        const { data } = await axios.post("/api/bookings/check-availability", {
          location: searchCriteria.location,
          pickupDate: searchCriteria.pickupDate,
          returnDate: searchCriteria.returnDate,
        });

        if (data.success) {
          setAvailableCars(data.availableCars);
          if (data.availableCars.length === 0) {
            toast.info("No cars available for the selected dates and location");
          }
        } else {
          toast.error(data.message || "Error fetching cars");
          setAvailableCars([]);
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching available cars");
        setAvailableCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCars();
  }, [searchCriteria, axios]);

  // Handle filter changes
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters({ ...filters, priceRange: [0, value] });
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: filters[filterType].includes(value)
        ? filters[filterType].filter(item => item !== value)
        : [...filters[filterType], value],
    });
  };

  const handleSeatingChange = (e) => {
    setFilters({ ...filters, seating: e.target.value });
  };

  const handleRatingChange = (e) => {
    setFilters({ ...filters, rating: parseInt(e.target.value) });
  };

  // Filter and sort cars
  const filteredCars = availableCars
    .filter(car => {
      const priceMatch = car.dailyRate <= filters.priceRange[1];
      const typeMatch = filters.carType.length === 0 || filters.carType.includes(car.type);
      const transmissionMatch = filters.transmission.length === 0 || filters.transmission.includes(car.transmission);
      const fuelMatch = filters.fuelType.length === 0 || filters.fuelType.includes(car.fuelType);
      const seatingMatch = filters.seating === "" || car.seating === parseInt(filters.seating);
      const ratingMatch = car.rating >= filters.rating;
      const availability = car.available === true || car.isAvailable === true;
      const availabilityMatch = !filters.availability || availability;

      return priceMatch && typeMatch && transmissionMatch && fuelMatch && seatingMatch && ratingMatch && availabilityMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.dailyRate - b.dailyRate;
        case "price-high":
          return b.dailyRate - a.dailyRate;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 20000],
      carType: [],
      transmission: [],
      fuelType: [],
      seating: "",
      rating: 0,
      availability: false,
    });
    setSortBy("relevance");
  };

  const pickupDate = new Date(searchCriteria.pickupDate).toLocaleDateString();
  const returnDate = new Date(searchCriteria.returnDate).toLocaleDateString();
  const days = Math.ceil(
    (new Date(searchCriteria.returnDate) - new Date(searchCriteria.pickupDate)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="search-results-container">
      {/* Search Summary */}
      <div className="search-summary">
        <div className="summary-content">
          <div>
            <h2 className="summary-title">Search Results</h2>
            <div className="summary-details">
              <div className="detail-item">
                <p className="detail-label">Location</p>
                <p className="detail-value">{searchCriteria.location}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Dates</p>
                <p className="detail-value">
                  {pickupDate} to {returnDate}
                </p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Duration</p>
                <p className="detail-value">{days} days</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClearSearch}
            className="clear-search-btn"
          >
            Clear Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading available cars...</p>
        </div>
      ) : availableCars.length === 0 ? (
        <div className="no-results-state">
          <p>No cars available for your search criteria</p>
          <button onClick={onClearSearch} className="reset-btn-large">
            Try Different Dates
          </button>
        </div>
      ) : (
        <div className="results-wrapper">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={resetFilters} className="reset-btn">Reset All</button>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-input">
                <span>₹0</span>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="1000"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Car Type Filter */}
            <div className="filter-group">
              <h4>Car Type</h4>
              <div className="checkbox-group">
                {['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Van'].map(type => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={filters.carType.includes(type)}
                      onChange={() => handleCheckboxChange('carType', type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div className="filter-group">
              <h4>Transmission</h4>
              <div className="checkbox-group">
                {['Manual', 'Automatic'].map(trans => (
                  <label key={trans}>
                    <input
                      type="checkbox"
                      checked={filters.transmission.includes(trans)}
                      onChange={() => handleCheckboxChange('transmission', trans)}
                    />
                    <span>{trans}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div className="filter-group">
              <h4>Fuel Type</h4>
              <div className="checkbox-group">
                {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(fuel => (
                  <label key={fuel}>
                    <input
                      type="checkbox"
                      checked={filters.fuelType.includes(fuel)}
                      onChange={() => handleCheckboxChange('fuelType', fuel)}
                    />
                    <span>{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seating Capacity Filter */}
            <div className="filter-group">
              <h4>Seating Capacity</h4>
              <select value={filters.seating} onChange={handleSeatingChange}>
                <option value="">All</option>
                <option value="2">2 Seater</option>
                <option value="4">4 Seater</option>
                <option value="5">5 Seater</option>
                <option value="8">8 Seater</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <select value={filters.rating} onChange={handleRatingChange}>
                <option value="0">All ratings</option>
                <option value="3">3★ and above</option>
                <option value="4">4★ and above</option>
                <option value="5">5★ only</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                />
                <span>Available Only</span>
              </label>
            </div>
          </aside>

          {/* Results Section */}
          <section className="results-main">
            <div className="results-header">
              <h2>Available Cars</h2>
              <div className="sort-controls">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {filteredCars.length > 0 ? (
              <>
                <p className="results-count">
                  Showing {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}
                </p>
                <div className="cars-grid">
                  {filteredCars.map(car => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>No cars match your filters. Try adjusting your criteria.</p>
                <button onClick={resetFilters} className="reset-btn-large">Reset Filters</button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
