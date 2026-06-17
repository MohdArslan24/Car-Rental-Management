import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";

const PaymentPage = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const location = useLocation();
  const { axios, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking data found");
      navigate("/");
    }
  }, [bookingData, navigate]);

  const handlePayment = async () => {
    if (!bookingData) {
      toast.error("Booking data is missing");
      return;
    }

    try {
      setLoading(true);

      // Create order on backend
      const { data: orderData } = await axios.post("/api/payment/create-order", {
        car: bookingData.carId,
        amount: bookingData.totalPrice,
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        returnDate: bookingData.returnDate,
        returnTime: bookingData.returnTime,
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
      });

      if (!orderData.success) {
        toast.error(orderData.message || "Failed to create order");
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: bookingData.totalPrice * 100, // Amount in paise
        currency: "INR",
        name: "Car Rental Management",
        description: `Booking for ${bookingData.carName}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setLoading(true);
            // Verify payment on backend
            const { data: verifyData } = await axios.post(
              "/api/payment/verify-payment",
              {
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                car: bookingData.carId,
                pickupDate: bookingData.pickupDate,
                pickupTime: bookingData.pickupTime,
                returnDate: bookingData.returnDate,
                returnTime: bookingData.returnTime,
                pickupLocation: bookingData.pickupLocation,
                returnLocation: bookingData.returnLocation,
                driverLicense: {
                  licenseNumber: bookingData.licenseNumber,
                  licenseExpiry: bookingData.licenseExpiry,
                  driverDOB: bookingData.driverDOB,
                },
                phoneNumber: bookingData.phoneNumber,
                insurance: bookingData.insurance,
                specialRequests: bookingData.specialRequests,
                price: bookingData.totalPrice,
              }            );

            if (verifyData.success) {
              toast.success("Payment successful! Booking confirmed");
              navigate("/my-bookings");
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            console.log(err);
            toast.error("Error verifying payment");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Error creating payment");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <Loader />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Payment</h1>
        <p className="text-center text-gray-500 mb-8">Complete your booking payment</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Car:</span>
              <span className="font-medium">{bookingData.carName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="font-medium">
                {new Date(bookingData.pickupDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Return Date:</span>
              <span className="font-medium">
                {new Date(bookingData.returnDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Daily Rate:</span>
              <span className="font-medium">{currency}{bookingData.pricePerDay}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Number of Days:</span>
              <span className="font-medium">{bookingData.noOfDays}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-3xl font-bold text-blue-600">
              {currency}{bookingData.totalPrice}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <p className="font-semibold mb-1">⚠️ Payment Information</p>
          <p>You will be redirected to Razorpay to complete the payment securely.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Secured by Razorpay •{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
