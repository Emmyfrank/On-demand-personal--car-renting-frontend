import { ICarCard } from "src/pages/root/HomePage";
import CarCountdown from "./CarCountdown";
import { Link } from "react-router-dom";
import { useUserContext } from "./AuthContext";

const CarCard = ({ car }: { car: ICarCard }) => {
  const { user } = useUserContext();
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
      {/* Car Image Slider */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={car.images[0] || "/images/default-car.jpg"}
          alt={`${car.brand} ${car.model}`}
          className="rounded-md"
        />
      </div>

      {/* Car Details */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-400 text-sm">
          {car.year} • {car.transmission}
        </p>
        <p className="text-gray-300 text-xs">Fuel: {car.fuelType}</p>

        {/* Availability Countdown */}
        <p className="text-green-400 text-sm mt-2">
          <CarCountdown availableUntil={car.availableUntil} />
        </p>

        {/* Price & Rent Button */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-xl font-bold">RW {car.pricePerDay}/day</p>
          <Link to={`/single_car_item/${car._id}`}>
            <button className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              {user.role === "business" ? "Rent Now" : "View Now"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
