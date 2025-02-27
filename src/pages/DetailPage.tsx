import { endPoint, useUserContext } from "@components/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ICar } from "./root/Dashboard/CarOwnerDashboard";
import LoadingComponent from "@components/loadingComponent";
import RentCarModal from "@components/RentCarModal";

const DetailPage = () => {
  const [car, setCar] = useState<ICar>();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const { user, isApproved } = useUserContext();
  const [orders, setOrders] = useState<any>();

  // Fetch car orders from the backend
  const getCarOrders = async () => {
    const response = await fetch(`${endPoint}/root/orders/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setOrders(data);
  };

  useEffect(() => {
    getCarOrders();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch(`${endPoint}/root/cars/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Get current date
        const currentDate = new Date();

        // Filter cars by approval status and availableUntil date
        const filteredData = data.cars.filter((car: ICar) => {
          const availableUntilDate = new Date(car.availableUntil);
          return car.isApproved === true && availableUntilDate >= currentDate;
        });

        const carDetail = filteredData.find(
          (singleCar: ICar) => singleCar._id === id
        );
        setCar(carDetail);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, [id]);

  if (loading || !car) return <LoadingComponent />;

  let doesCarExist = false;
  if (orders) {
    doesCarExist = orders.some((order: any) => order.carId === id);
    console.log(doesCarExist);
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Car Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {car.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Car Details */}
        <h1 className="text-3xl font-bold mt-6">
          {car.brand} {car.model} ({car.year})
        </h1>
        <p className="text-gray-300 mt-2">{car.description}</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Fuel Type:</span> {car.fuelType}
          </p>
          <p>
            <span className="font-semibold">Transmission:</span>{" "}
            {car.transmission}
          </p>
          <p>
            <span className="font-semibold">Price Per Day:</span>{" "}
            <p className="text-nowrap">RW {car.pricePerDay}</p>
          </p>
          <p>
            <span className="font-semibold">Available Until:</span>{" "}
            {new Date(car.availableUntil).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(car.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Booking Button */}
        {user.role === "business" &&
          (isApproved ? (
            <div className="mt-6">
              {doesCarExist ? (
                <button
                  disabled
                  className="px-6 py-2 bg-blue-300 hover:bg-blue-600 text-black rounded-lg"
                >
                  Order Pending...
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Rent This Car
                </button>
              )}
            </div>
          ) : (
            <div className="bg-red-700/15 py-2 px-4 rounded-lg mt-3">
              <p className="text-red-500 font-semibold mt-6">
                Approvement pending...
              </p>
            </div>
          ))}

        {isModalOpen && (
          <>
            {/* Rent Car Modal */}
            <RentCarModal
              pricePerDay={car.pricePerDay as any}
              carId={car._id}
              setIsModalOpen={setIsModalOpen}
              ownerId={car.ownerId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
