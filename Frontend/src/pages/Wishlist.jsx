import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import CarCard from '../components/CarCard';

const Wishlist = () => {
  const { wishlist, fetchWishlist, loading } = useAppContext();

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist</h1>

        {loading && <div className="text-gray-600">Loading wishlist...</div>}

        {!loading && wishlist?.length === 0 && (
          <div className="text-gray-600">No cars in your wishlist yet.</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist?.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
