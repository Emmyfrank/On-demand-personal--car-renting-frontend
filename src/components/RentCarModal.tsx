import React, { ChangeEvent, useState } from "react";
import { endPoint, useUserContext } from "./AuthContext";

interface RentCarModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carId: string;
  pricePerDay: number; // Price of the car per day
  ownerId: string; // ID of the car owner
}

const RentCarModal = ({
  ownerId,
  carId,
  pricePerDay,
  setIsModalOpen,
}: RentCarModalProps) => {
  const { businessId, user } = useUserContext();
  const [orderData, setOrderData] = useState({
    carOwnerId: ownerId,
    clientId: user._id,
    carId,
    businessId,
    startDate: "",
    endDate: "",
    contactNumber: "",
    totalAmount: 0, // Total price calculation
  });
  const [loading, setLoading] = useState(false);

  // Function to calculate the total rental price
  const calculateTotalPrice = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
      return days > 0 ? days * Number(pricePerDay) : 0; // Ensure non-negative price
    }
    return 0;
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prevData) => {
      const newOrderData = { ...prevData, [name]: value };

      // Recalculate total price when dates change
      if (name === "startDate" || name === "endDate") {
        newOrderData.totalAmount = calculateTotalPrice(
          newOrderData.startDate,
          newOrderData.endDate
        );
      }

      return newOrderData;
    });
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(`${endPoint}/root/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data.order) {
        setIsModalOpen(false);
        window.location.replace("/");
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Rent This Car</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={orderData.startDate}
              required
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={orderData.endDate}
              required
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={orderData.contactNumber}
              required
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          {/* Total Price */}
          <div>
            <label className="block text-gray-700">Total Price</label>
            <input
              type="text"
              value={`RW ${orderData.totalAmount}`}
              readOnly
              className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed text-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
            disabled={orderData.totalAmount === 0 || loading}
          >
            {loading ? "Confirming..." : "Confirm Rental"}
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RentCarModal;
