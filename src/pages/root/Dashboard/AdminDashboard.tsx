import { endPoint } from "@components/AuthContext";
import { ICar } from "./CarOwnerDashboard";
import { useEffect, useState } from "react";
import { Button } from "@components/components/ui/button";
import CarCountdown from "@components/CarCountdown";
import { Loader2, X } from "lucide-react";

export interface IBusiness {
  contact: string;
  createdAt: string;
  description: string;
  isApproved: boolean;
  licenseFile: string;
  location: string;
  name: string;
  orders: string;
  ownerId: string;
  rentals: string;
  tin: string;
  _id: string;
  declineReason: string;
}

const AdminDashboard = ({
  cars,
  setCars,
  businesses,
  setBusinesses,
}: {
  cars: ICar[];
  setCars: any;
  businesses: IBusiness[];
  setBusinesses: any;
}) => {
  const [type, setType] = useState("Pending");
  const [filteredCars, setFilteredCars] = useState<ICar[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<IBusiness[]>([]);
  const [filteredCar, setFilteredCar] = useState<ICar>();
  const [approveType, setApproveType] = useState("car");
  const [declineReason, setDeclineReason] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isCarApproved, setIsCarApproved] = useState(false);

  const approveCar = async (carId: string) => {
    setIsCarApproved(true);
    const response = await fetch(`${endPoint}/root/cars/update/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data) {
      // Instead of window.location.reload(), update the cars array directly
      const updatedCars = cars.map((car) =>
        car._id === carId ? { ...car, isApproved: true } : car
      );
      setCars(updatedCars);
      setIsCarApproved(false);
    }
  };

  const approveBusiness = async (businessId: string) => {
    setIsApproving(true);
    const response = await fetch(
      `${endPoint}/root/business/update/${businessId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data) {
      // Instead of window.location.reload(), update the cars array directly
      const updatedBusiness = businesses.map((business) =>
        business._id === businessId
          ? { ...business, isApproved: true }
          : business
      );
      setBusinesses(updatedBusiness);
    }
    setIsApproving(false);
  };

  const filterData = () => {
    let filtered;
    switch (type) {
      case "Pending":
        filtered = cars.filter(
          (car) => !car.isApproved && car.declineReason === undefined
        );
        break;
      case "Approved":
        filtered = cars.filter((car) => car.isApproved);
        break;
      case "Rejected":
        filtered = cars.filter(
          (car) => !car.isApproved && car.declineReason !== undefined
        );
        break;
      default:
        filtered = cars;
    }
    setFilteredCars(filtered);
  };

  const filterBusiness = () => {
    let filtered;
    switch (type) {
      case "Pending":
        filtered = businesses.filter(
          (business) =>
            !business.isApproved && business.declineReason === undefined
        );
        break;
      case "Approved":
        filtered = businesses.filter((business) => business.isApproved);
        break;
      case "Rejected":
        filtered = businesses.filter(
          (business) =>
            !business.isApproved && business.declineReason !== undefined
        );
        break;
      default:
        filtered = businesses;
    }
    setFilteredBusinesses(filtered);
  };

  // Trigger filtering based on approveType and type changes
  useEffect(() => {
    if (approveType === "car") {
      filterData();
    } else if (approveType === "company") {
      filterBusiness();
    }
  }, [type, cars, businesses, approveType]);

  const showPopup = (cardId: string) => {
    const detailCar = cars.find((c: ICar) => c._id === cardId);
    if (detailCar) {
      setFilteredCar(detailCar);
    }
  };

  const declineBusiness = async (businessId: string) => {
    setSubmitting(true);
    const response = await fetch(
      `${endPoint}/root/business/update/${businessId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          declineReason,
        }),
      }
    );

    const data = await response.json();
    if (data) {
      window.location.reload();
    }
  };

  const declineCar = async (carId: string) => {
    setSubmitting(true);
    const response = await fetch(`${endPoint}/root/cars/update/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        declineReason,
      }),
    });

    const data = await response.json();
    if (data) {
      window.location.reload();
    }
  };

  console.log("businesses", businesses);
  return (
    <div className="min-h-screen bg-gray-900 text-white/50 p-6">
      {/* Car details */}
      {filteredCar && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setFilteredCar(undefined)}
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
              {filteredCar.images && (
                <img
                  src={filteredCar.images[0]}
                  alt={filteredCar.model}
                  className="mt-4 w-1/2 h-48 object-cover rounded-lg shadow"
                />
              )}
              {filteredCar.images && (
                <img
                  src={filteredCar.images[1]}
                  alt={filteredCar.model}
                  className="mt-4 w-1/2 h-48 object-cover rounded-lg shadow"
                />
              )}
            </div>

            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Brand:</strong>{" "}
                {filteredCar.brand}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Model:</strong>{" "}
                {filteredCar.model}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Year:</strong>{" "}
                {filteredCar.year}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Price per Day:</strong>{" "}
                <p className="text-nowrap">RW {filteredCar.pricePerDay}</p>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Fuel Type:</strong>{" "}
                {filteredCar.fuelType}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Transmission:</strong>{" "}
                {filteredCar.transmission}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Description:</strong>{" "}
                {filteredCar.description}
              </p>
              <p className="text-lg font-semibold text-black">
                <strong className="text-gray-900">Available Until:</strong>
                <div className="bg-blue-700 px-2">
                  {/* Pass the formatted availableUntil to CarCountdown */}
                  <CarCountdown availableUntil={filteredCar.availableUntil} />
                </div>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Is Approved:</strong>
                {filteredCar.isApproved ? "Yes" : "No"}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Is Rented By Company:</strong>{" "}
                {filteredCar.isRentedByBusiness ? "Yes" : "No"}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong className="text-gray-900">Location:</strong>{" "}
                {filteredCar.location}
              </p>

              {/* Display the insurance file */}

              <div className="flex flex-col items-start justify-between gap-5">
                {filteredCar.insuranceFileUrl && (
                  <div>
                    <img
                      src={filteredCar.insuranceFileUrl}
                      alt={filteredCar.model}
                      className="mt-4 w-full mb-2 h-48 object-cover rounded-lg shadow"
                    />
                    <p className="text-black">Insurance card</p>
                  </div>
                )}
                {filteredCar.yellowCardFileUrl && (
                  <div>
                    <img
                      src={filteredCar.yellowCardFileUrl}
                      alt={filteredCar.model}
                      className="mt-4 w-full mb-2 h-48 object-cover rounded-lg shadow"
                    />
                    <p className="text-black">Yellow card</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      {/* Admin button */}
      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={() => setApproveType("car")}
          className={`w-full bg-slate-700 ${
            approveType === "car" && "border-2 border-white"
          }`}
        >
          Cars
        </Button>
        <Button
          onClick={() => setApproveType("company")}
          className={`w-full bg-blue-700 ${
            approveType !== "car" && "border-2 border-white"
          }`}
        >
          Company
        </Button>
      </div>
      {approveType === "car" && (
        <div className="flex items-center gap-2 mb-2">
          <Button
            onClick={() => setType("Pending")}
            className={`w-full bg-black ${
              type === "Pending" && "border-b border-white"
            }`}
          >
            Pending cars
          </Button>
          <Button
            onClick={() => setType("Approved")}
            className={`w-full bg-green-700 hover:bg-green-900 ${
              type === "Approved" && "border-b border-white"
            }`}
          >
            Approved cars
          </Button>
          <Button
            onClick={() => setType("Rejected")}
            className={`w-full bg-red-700 hover:bg-red-900 ${
              type === "Rejected" && "border-b border-white"
            }`}
          >
            Rejected cars
          </Button>
        </div>
      )}
      {approveType === "company" && (
        <div className="flex items-center gap-2 mb-2">
          <Button
            onClick={() => setType("Pending")}
            className={`w-full bg-black ${
              type === "Pending" && "border-b border-white"
            }`}
          >
            Pending company
          </Button>
          <Button
            onClick={() => setType("Approved")}
            className={`w-full bg-green-700 hover:bg-green-900 ${
              type === "Approved" && "border-b border-white"
            }`}
          >
            Approved company
          </Button>
          <Button
            onClick={() => setType("Rejected")}
            className={`w-full bg-red-700 hover:bg-red-900 ${
              type === "Rejected" && "border-b border-white"
            }`}
          >
            Rejected company
          </Button>
        </div>
      )}

      <div>
        {approveType === "car" &&
          (filteredCars ? (
            <div>
              {filteredCars.length === 0 ? (
                <p className="text-gray-400">
                  {type === "Pending" && "No cars available for approval."}
                  {type === "Approved" && "No approved cars available"}
                  {type === "Rejected" && "No rejected cars available."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-700">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="text-nowrap px-14">Image</th>
                        <th className="text-nowrap p-3">Brand</th>
                        <th className="text-nowrap p-3">Model</th>
                        <th className="text-nowrap p-3">Year</th>
                        <th className="text-nowrap p-3">Price/Day</th>
                        <th className="text-nowrap p-3">Status</th>
                        <th className="text-nowrap p-3">Insurance</th>
                        <th className="text-nowrap p-3">Yellow card</th>
                        <th className="text-nowrap p-3">Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCars.map((car) => (
                        <tr key={car._id} className="border-b border-gray-700">
                          <td className="p-3">
                            <img
                              src={car.images[0]}
                              alt={car.brand}
                              className="w-full h-20 object-cover rounded-md"
                            />
                            <button
                              onClick={() => showPopup(car._id)}
                              className="w-full py-[3px] bg-white text-black mt-2 hover:text-black hover:bg-white rounded-lg"
                            >
                              view
                            </button>
                          </td>
                          <td className="p-3">{car.brand}</td>
                          <td className="p-3">{car.model}</td>
                          <td className="p-3">{car.year}</td>
                          <td className="p-3">
                            <p className="text-nowrap">RW {car.pricePerDay}</p>
                          </td>
                          <td className="p-3 text-nowrap">
                            {car.isApproved ? (
                              <span className="text-green-500">Approved</span>
                            ) : (
                              <span className="text-red-500">
                                {!car.isApproved &&
                                car.declineReason !== undefined
                                  ? "Rejected"
                                  : "Pending"}
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <a
                              href={car.insuranceFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-nowrap text-center"
                            >
                              View
                            </a>
                          </td>
                          <td className="text-center">
                            <a
                              href={car.yellowCardFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-nowrap"
                            >
                              View
                            </a>
                          </td>
                          <td className="p-3 text-nowrap">
                            {!car.isApproved &&
                              car.declineReason === undefined && (
                                <div className="flex items-center gap-4">
                                  <button
                                    disabled={isCarApproved}
                                    onClick={() => approveCar(car._id)}
                                    className="bg-blue-500 text-white p-2 rounded w-full"
                                  >
                                    {isCarApproved ? "Approving..." : "Approve"}
                                  </button>
                                  <button
                                    onClick={() => setShowTextArea(true)}
                                    className="bg-red-500 text-white p-2 rounded w-full"
                                  >
                                    Decline
                                  </button>
                                  {showTextArea && (
                                    <div className="fixed z-20 inset-0 bg-black/50 flex items-center justify-center">
                                      <div className="w-fit px-4 rounded-lg bg-white text-black flex flex-col space-y-3 py-10">
                                        <Button
                                          className="w-fit self-end"
                                          onClick={() => setShowTextArea(false)}
                                        >
                                          <X />
                                        </Button>
                                        <p className="font-bold">
                                          Provide a good reason why you decline
                                          this{" "}
                                          {type === "company"
                                            ? "company"
                                            : "car"}
                                          .
                                        </p>
                                        <textarea
                                          rows={3}
                                          value={declineReason}
                                          onChange={(e) =>
                                            setDeclineReason(e.target.value)
                                          }
                                          className="border w-full p-2 mt-2 rounded border-blue-500"
                                        ></textarea>
                                        <Button
                                          disabled={submitting}
                                          onClick={() => declineCar(car._id)}
                                        >
                                          {submitting
                                            ? "Submitting..."
                                            : "Submit"}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            {(car.isApproved ||
                              car.declineReason !== undefined) && (
                              <Button
                                variant="outline"
                                className="p-2 rounded w-full bg-blue-700 text-black"
                              >
                                ☑️
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <p>
              <Loader2 className="w-7 h-7 animate-spin" />
            </p>
          ))}
      </div>

      <div>
        {filteredBusinesses ? (
          <div>
            {approveType === "company" && (
              <div>
                {filteredBusinesses.length === 0 ? (
                  <p className="text-gray-400">
                    {type === "Pending" && "No company available for approval."}
                    {type === "Approved" && "No approved company available"}
                    {type === "Rejected" && "No rejected company available."}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-700">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="text-nowrap p-3">Name</th>
                          <th className="text-nowrap p-3">Location</th>
                          <th className="text-nowrap p-3">Contact</th>
                          <th className="text-nowrap p-3">Tin</th>
                          <th className="text-nowrap p-3">License File</th>
                          <th className="text-nowrap p-3">Approval</th>
                          <th className="text-nowrap p-3 px-[70px]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBusinesses.map((business) => (
                          <tr
                            key={business._id}
                            className="border-b border-gray-700"
                          >
                            <td className="p-3">{business.name}</td>
                            <td className="p-3">{business.location}</td>
                            <td className="p-3">{business.contact}</td>
                            <td className="p-3">{business.tin}</td>
                            <td className="p-3">
                              <a
                                href={business.licenseFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-nowrap"
                              >
                                View License
                              </a>
                            </td>
                            <td className="p-3 text-nowrap">
                              {business.isApproved ? (
                                <span className="text-green-500">Approved</span>
                              ) : (
                                <span className="text-red-500">
                                  {!business.isApproved &&
                                  business.declineReason !== undefined
                                    ? "Rejected"
                                    : "Pending"}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-nowrap">
                              {!business.isApproved &&
                                business.declineReason === undefined && (
                                  <div className="flex items-center gap-4">
                                    <button
                                      disabled={isApproving}
                                      onClick={() =>
                                        approveBusiness(business._id)
                                      }
                                      className="bg-blue-500 text-white p-2 rounded w-full"
                                    >
                                      {isApproving ? "Approving..." : "Approve"}
                                    </button>
                                    <button
                                      onClick={() => setShowTextArea(true)}
                                      className="bg-red-500 text-white p-2 rounded w-full"
                                    >
                                      Decline
                                    </button>
                                    {showTextArea && (
                                      <div className="fixed z-20 inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="w-fit px-4 rounded-lg bg-white text-black flex flex-col space-y-3 py-10">
                                          <Button
                                            className="w-fit self-end"
                                            onClick={() =>
                                              setShowTextArea(false)
                                            }
                                          >
                                            <X />
                                          </Button>
                                          <p className="font-bold">
                                            Provide a good reason why you
                                            decline this company.
                                          </p>
                                          <textarea
                                            rows={3}
                                            value={declineReason}
                                            onChange={(e) =>
                                              setDeclineReason(e.target.value)
                                            }
                                            className="border w-full p-2 mt-2 rounded border-blue-500"
                                          ></textarea>
                                          <Button
                                            disabled={submitting}
                                            onClick={() =>
                                              declineBusiness(business._id)
                                            }
                                          >
                                            {submitting
                                              ? "Submitting..."
                                              : "Submit"}
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              {(business.isApproved ||
                                business.declineReason !== undefined) && (
                                <Button
                                  variant="outline"
                                  className="p-2 rounded w-full bg-blue-700 text-black"
                                >
                                  ☑️
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>
            <Loader2 className="w-7 h-7 animate-spin" />
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
