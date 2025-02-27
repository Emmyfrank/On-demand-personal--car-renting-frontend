import { endPoint, useUserContext } from "@components/AuthContext";
import CarCountdown from "@components/CarCountdown";
import { Button } from "@components/components/ui/button";
import { Check, Eye, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface ICar {
  availableUntil: string;
  brand: string;
  businessId: string;
  createdAt: string;
  description: string;
  fuelType: string;
  images: string[];
  isApproved: boolean;
  isRentedByBusiness: boolean;
  model: string;
  location: string;
  ownerId: string;
  pricePerDay: string;
  transmission: string;
  insuranceFileUrl: string;
  yellowCardFileUrl: string;
  updatedAt: string;
  declineReason: string;
  year: string;
  _id: string;
}

const CarOwnerDashboard = ({
  cars,
  setCars,
}: {
  cars: ICar[];
  setCars: any;
}) => {
  const [carForDetail, setCarForDetail] = useState<ICar>();
  const [addTime, setAddTime] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [availableUntil, setAvailableUntil] = useState<string>();
  const [showType, setShowType] = useState("car");
  const [orders, setOrders] = useState<any>();
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [currentTime, setCurrentTime] = useState();

  const { user } = useUserContext();

  const handleCarClick = (carId: string) => {
    const car = cars.find((c: ICar) => c._id === carId);
    setCarForDetail(car);
  };

  const handleAddTime = async () => {
    const cfm = window.confirm(
      "Once you update your car time availability, your car will be automatically unpublished until new approval from administration."
    );
    if (!cfm) return;
    try {
      setSaving(true);
      const formattedAvailableUntil = new Date(
        availableUntil as string
      ).toISOString();

      const response = await fetch(
        `${endPoint}/root/cars/update/${carForDetail?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availableUntil: formattedAvailableUntil }),
        }
      );

      const data = await response.json();
      if (data) {
        const updatedCar = cars.map((car) =>
          car._id === carForDetail?._id
            ? { ...car, availableUntil: availableUntil, isApproved: false }
            : car
        );
        setCars(updatedCar);
      }
      setCarForDetail(undefined);
    } catch (error) {
      alert("Try again");
      console.error("Error adding time:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (
    orderId: string,
    action: string,
    carId: string
  ) => {
    const proceed = window.confirm("Are you sure you want to proceed?");
    if (!proceed) return;
    if (action === "confirmed") {
      setLoadingConfirm(true);
    } else {
      setLoadingCancel(true);
    }
    try {
      const response = await fetch(
        `${endPoint}/root/orders/update/${orderId}/${action}/${carId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data) {
        const updatedOrders = orders.map((order: any) =>
          order._id === orderId ? { ...order, status: action } : order
        );
        setOrders(updatedOrders);
      }
      console.log(`Action: ${action} for carId: ${orderId}`);

      setLoadingConfirm(false);
      setLoadingCancel(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConfirm(false);
      setLoadingCancel(false);
    }
  };

  // Fetch car orders from the backend
  const getCarOrders = async () => {
    const response = await fetch(`${endPoint}/root/orders/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const filteredData = data.filter(
      (item: any) => String(item.carOwnerId) === String(user._id)
    );
    setOrders(filteredData);
  };

  useEffect(() => {
    getCarOrders();
  }, []);

  function CarAvailability(availableUntil: string) {
    const date = new Date(availableUntil);
    console.log("available time ", availableUntil);

    // Format the date as yyyy-mm-ddTHH:mm
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    setCurrentTime(formattedDate as any); // Set currentTime to the formatted date
  }

  return (
    <div className="mt-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">Your Cars</h2>

      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={() => setShowType("car")}
          className={`w-full bg-slate-700 ${
            showType === "car" && "border-2 border-white"
          }`}
        >
          Cars
        </Button>
        <Button
          onClick={() => setShowType("order")}
          className={`w-full bg-blue-700 ${
            showType === "order" && "border-2 border-white"
          }`}
        >
          Company Orders
        </Button>
      </div>

      <div>
        {showType === "car" && (
          <div>
            {cars.length === 0 ? (
              <p className="text-gray-400">No cars added yet.</p>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-md">
                  <thead>
                    <tr className="text-left bg-gray-700 text-white">
                      <th className="text-nowrap py-2 px-14 border border-gray-600">
                        Image
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Brand
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Model
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Year
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Fuel Type
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Price/Day
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Transmission
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Available Until
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Status
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Taken by company
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <>
                        <tr
                          key={car._id}
                          className="border-t border-gray-600 hover:bg-gray-800 transition"
                        >
                          <td className="py-2 px-4 border border-gray-600">
                            <img
                              src={car.images?.[0]}
                              alt={car.brand}
                              className="w-20 h-14 object-cover rounded"
                            />
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.brand}
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.model}
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.year}
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.fuelType}
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            <div className="flex items-center gap-2 flex-nowrap">
                              <p className="text-nowrap">
                                RW {car.pricePerDay}
                              </p>
                              <button
                                onClick={() => handleCarClick(car._id)}
                                className="text-black bg-white w-full flex items-center justify-center rounded-md px-4"
                              >
                                <Eye />
                              </button>
                            </div>
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.transmission}
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            <CarCountdown availableUntil={car.availableUntil} />
                          </td>
                          <td className="py-2 px-4 border border-gray-600">
                            {car.isApproved ? (
                              <span className="text-green-400">Approved</span>
                            ) : car.declineReason !== undefined ? (
                              <span className="text-red-400">Rejected</span>
                            ) : (
                              <span className="text-yellow-400">Pending</span>
                            )}
                          </td>
                          <td className="py-2 px-4 border border-gray-600 text-center">
                            {car.isRentedByBusiness ? "True" : "False"}
                          </td>
                        </tr>
                        {car.declineReason !== undefined && (
                          <div className="text-white bg-red-700/15 p-2 rounded-lg text-sm">
                            The above car was rejected with the following
                            message:{" "}
                            <span className="font-bold underline block">
                              {car.declineReason}
                            </span>
                          </div>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showType === "order" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Company Orders</h3>
          {orders?.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              {orders ? (
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-md">
                  <thead>
                    <tr className="text-left bg-gray-700 text-white">
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Company
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Location
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Contact
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Start Date
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        End Date
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Status
                      </th>
                      <th className="text-nowrap py-2 px-7 border border-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order: any) => (
                      <tr
                        key={order._id}
                        className="border-t border-gray-600 hover:bg-gray-800 transition"
                      >
                        <td className="py-2 px-4 border border-gray-600">
                          {order.businessId.name}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          {order.businessId.location}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          {order.businessId.contact}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          {new Date(order.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          {new Date(order.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          {order.status}
                        </td>
                        <td className="py-2 px-4 border border-gray-600">
                          <div className="flex items-center gap-2">
                            {order.status === "confirmed" ||
                            order.status === "cancelled" ? (
                              <button className="flex items-center bg-blue-700 w-full justify-center gap-4 rounded-md py-2 px-4">
                                Done <Check />
                              </button>
                            ) : (
                              <>
                                <button
                                  disabled={loadingConfirm || loadingCancel}
                                  onClick={() =>
                                    handleAction(
                                      order._id,
                                      "confirmed",
                                      order.carId
                                    )
                                  }
                                  className="bg-gray-700 text-white py-1 px-3 rounded-md"
                                  value="confirm"
                                >
                                  {loadingConfirm ? "Confirm..." : "Confirm"}
                                </button>
                                <button
                                  disabled={loadingConfirm || loadingCancel}
                                  onClick={() =>
                                    handleAction(
                                      order._id,
                                      "cancelled",
                                      order.carId
                                    )
                                  }
                                  className="bg-red-700 text-white py-1 px-3 rounded-md"
                                  value="cancel"
                                >
                                  {loadingCancel ? "Cancel..." : "Cancel"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xl text-center mt-2">No orders available</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* POPUP FOR DETAILS */}
      {carForDetail && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setCarForDetail(undefined)}
              className="absolute top-3 right-3 text-white px-4 py-2 rounded-full text-sm font-medium bg-red-700 hover:bg-red-900 transition"
            >
              Close
            </button>

            {/* Car Details */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Car Details
            </h3>
            {/* Car Image */}
            <div className="flex items-center justify-between gap-5">
              {carForDetail.images && (
                <img
                  src={carForDetail.images[0]}
                  alt={carForDetail.model}
                  className="mt-4 w-1/2 h-48 object-cover rounded-lg shadow"
                />
              )}
              {carForDetail.images && (
                <img
                  src={carForDetail.images[1]}
                  alt={carForDetail.model}
                  className="mt-4 w-1/2 h-48 object-cover rounded-lg shadow"
                />
              )}
            </div>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Brand:</strong>{" "}
                {carForDetail.brand}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Model:</strong>{" "}
                {carForDetail.model}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Year:</strong>{" "}
                {carForDetail.year}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Price per Day:</strong>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Fuel Type:</strong>{" "}
                {carForDetail.fuelType}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Transmission:</strong>{" "}
                {carForDetail.transmission}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Description:</strong>{" "}
                {carForDetail.description}
              </p>
              {/* TIME INPUT */}
              {addTime ? (
                carForDetail.isRentedByBusiness ? (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-red-700 bg-red-700/15 py-2 px-5 rounded-lg">
                      You can't update time for a rented car
                    </p>
                    <Button onClick={() => setAddTime(false)}>
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="datetime-local"
                      className="w-full text-black border border-gray-300 rounded-md p-2 focus:outline-none"
                      value={availableUntil ? availableUntil : currentTime}
                      onChange={(e) => setAvailableUntil(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button disabled={saving} onClick={handleAddTime}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button onClick={() => setAddTime(false)}>
                        <X />
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-black">
                    <strong className="text-gray-900">Available Until:</strong>
                    <div className="bg-blue-700 px-2">
                      <CarCountdown
                        availableUntil={carForDetail.availableUntil}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setAddTime(true);
                        CarAvailability(carForDetail.availableUntil);
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Is Approved:</strong>{" "}
                {carForDetail.isApproved ? "Yes" : "No"}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Is Rented By Company:</strong>{" "}
                {carForDetail.isRentedByBusiness ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarOwnerDashboard;
