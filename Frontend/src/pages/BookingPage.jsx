import React from "react";
import Title from "../components/Title";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios, user, inquiries, fetchInquiries } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInquiries;
      setLoading(false);
    }
  }, [user]);

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleContactOwner = (inquiryId) => {
    const inquiry = inquiries.find(i => i._id === inquiryId);
    if (inquiry?.conversationId) {
      navigate(`/messages?conversation=${inquiry.conversationId}`);
    }
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const { data } = await axios.post("/api/inquiries/change-status", {
        inquiryId,
        status: newStatus,
      });

      if (data.success) {
        toast.success("Inquiry status updated successfully");
        fetchInquiries();
        setShowModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating inquiry status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!user) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 max-w-7xl">
        <Title
          title={"My Inquiries"}
          subTitle={"View and manage your car rental inquiries"}
          align={"left"}
        />
        <p className="text-center text-gray-500 mt-8">Please login to view your inquiries</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 max-w-7xl">
        <Title
          title={"My Inquiries"}
          subTitle={"View and manage your car rental inquiries"}
          align={"left"}
        />
        <p className="text-center text-gray-500 mt-8">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 max-w-7xl">
      <Title
        title={"My Inquiries"}
        subTitle={"View and manage your car rental inquiries"}
        align={"left"}
      />

      <div>
        {inquiries?.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No inquiries yet</p>
            <p className="text-sm mt-2">Browse cars and create an inquiry to get started</p>
          </div>
        ) : (
          inquiries?.map((inquiry, index) => {
            const createdDate = new Date(inquiry.createdAt).toLocaleDateString();
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-300 rounded-lg mt-5 first:mt-12" key={inquiry._id}>
                {/* Car Image */}
                <div className="col-span-1">
                  <div className="rounded-md overflow-hidden mb-3 bg-gray-200 h-40 flex items-center justify-center">
                    {inquiry.car?.image ? (
                      <img
                        src={inquiry.car.image}
                        alt={inquiry.car?.brand}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">No Image</div>
                    )}
                  </div>
                  <p className="text-lg font-medium">
                    {inquiry.car?.brand || "Car"} {inquiry.car?.model || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {inquiry.car?.year || "N/A"} • {inquiry.car?.category || "N/A"}
                  </p>
                </div>

                {/* Inquiry Details */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <p className="bg-blue-100 text-blue-700 rounded px-3 py-1.5 text-sm font-medium">
                      Inquiry #{index + 1}
                    </p>
                    <p
                      className={`rounded px-3 py-1.5 text-sm font-medium capitalize ${
                        inquiry.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : inquiry.status === "active"
                          ? "bg-green-100 text-green-700"
                          : inquiry.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inquiry.status}
                    </p>
                  </div>

                  {/* Owner Info */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">Car Owner</p>
                    <div className="flex items-center gap-2">
                      {inquiry.owner?.image && (
                        <img
                          src={inquiry.owner.image}
                          alt={inquiry.owner?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">{inquiry.owner?.name || "Unknown"}</span>
                      {inquiry.owner?.rating && (
                        <span className="text-yellow-500 text-sm">⭐ {inquiry.owner.rating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>

                  {/* Dates if provided */}
                  {inquiry.pickupDate && inquiry.returnDate && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Pickup Date</p>
                        <p className="font-medium">
                          {new Date(inquiry.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Return Date</p>
                        <p className="font-medium">
                          {new Date(inquiry.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Created: {createdDate}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-1 flex flex-col justify-around gap-2">
                  <button 
                    onClick={() => handleContactOwner(inquiry._id)}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors font-medium"
                  >
                    💬 Message
                  </button>
                  <button 
                    onClick={() => handleViewDetails(inquiry)}
                    className="text-blue-600 rounded-lg border border-blue-600 px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Inquiry Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Car Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg overflow-hidden bg-gray-200 h-40">
                  {selectedInquiry.car?.image ? (
                    <img
                      src={selectedInquiry.car.image}
                      alt={selectedInquiry.car?.brand}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedInquiry.car?.brand || "Car"} {selectedInquiry.car?.model || ""}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Year:</span>{" "}
                      <span className="font-medium">{selectedInquiry.car?.year || "N/A"}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Location:</span>{" "}
                      <span className="font-medium">{selectedInquiry.car?.location || "N/A"}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Fuel Type:</span>{" "}
                      <span className="font-medium">{selectedInquiry.car?.fuelType || "N/A"}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Transmission:</span>{" "}
                      <span className="font-medium">{selectedInquiry.car?.transmission || "N/A"}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Daily Rate:</span>{" "}
                      <span className="font-medium">{currency}{selectedInquiry.car?.dailyRate || "Contact Owner"}</span>
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Owner Info */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2 font-semibold">Car Owner</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  {selectedInquiry.owner?.image && (
                    <img
                      src={selectedInquiry.owner.image}
                      alt={selectedInquiry.owner?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{selectedInquiry.owner?.name}</p>
                    <p className="text-sm text-gray-500">Phone: {selectedInquiry.owner?.phone || "Not provided"}</p>
                    {selectedInquiry.owner?.rating && (
                      <p className="text-sm text-yellow-600">⭐ Rating: {selectedInquiry.owner.rating.toFixed(1)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2 font-semibold">Inquiry Information</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Status</p>
                    <p className="font-semibold capitalize">{selectedInquiry.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Created</p>
                    <p className="font-semibold">{new Date(selectedInquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedInquiry.pickupDate && (
                  <div className="mt-3">
                    <p className="text-gray-600 text-xs mb-1">Suggested Dates</p>
                    <p className="font-semibold text-sm">
                      {new Date(selectedInquiry.pickupDate).toLocaleDateString()} to {new Date(selectedInquiry.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleContactOwner(selectedInquiry._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  💬 Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
