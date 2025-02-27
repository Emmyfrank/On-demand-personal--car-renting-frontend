import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessDashboard = ({
  cars,
  businessDeclineReason,
}: {
  cars: any;
  businessDeclineReason: string | undefined;
}) => {
  const orderedCars = cars?.orders;

  console.log(orderedCars);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Company Dashboard</h2>
      {businessDeclineReason && businessDeclineReason !== undefined && (
        <div className="bg-red-500 p-2 rounded-lg mb-2">
          <p className="text-white text-sm mb-4">
            Your business has been declined. Reason:{" "}
            <span className="underline font-bold block">
              {businessDeclineReason}
            </span>
            <br />
            For more details please click
            <a
              href="mailto:shyakajeandedieu31@gmail.com"
              className="underline text-black font-bold px-4"
            >
              HERE
            </a>
            to contact us
          </p>
        </div>
      )}

      <div>
        {!orderedCars ? (
          <p>
            <Loader2 className="w-7 h-7 animate-spin" />
          </p>
        ) : (
          <div>
            {orderedCars.length === 0 ? (
              <p className="text-gray-400">No orders available right now.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="text-nowrap p-3 px-14">Car Image</th>
                      <th className="text-nowrap p-3">Car Brand</th>
                      <th className="text-nowrap p-3">Car Model</th>
                      <th className="text-nowrap p-3">Start Date</th>
                      <th className="text-nowrap p-3">End Date</th>
                      <th className="text-nowrap p-3">Total Price</th>
                      <th className="text-nowrap p-3">Status</th>
                      <th className="text-nowrap p-3">Contact</th>
                      <th className="text-nowrap p-3">Location</th>
                      <th className="text-nowrap p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderedCars.map((order: any) =>
                      order.carId ? ( // ✅ Only render rows if `carId` exists
                        <tr
                          key={order._id}
                          className="border-b border-gray-700"
                        >
                          <td className="p-3">
                            <img
                              src={
                                order.carId.images?.[0] || "/placeholder.jpg"
                              }
                              alt={order.carId.brand || "Car"}
                              className="w-20 h-14 object-cover rounded-md"
                            />
                          </td>
                          <td className="p-3">{order.carId.brand}</td>
                          <td className="p-3">{order.carId.model}</td>
                          <td className="p-3">
                            {new Date(order.startDate).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            {new Date(order.endDate).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-nowrap">
                            RW {order.totalPrice.toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap">
                            {order.status === "pending" ? (
                              <span className="text-red-500">Pending</span>
                            ) : order.status === "cancelled" ? (
                              <span className="text-red-500">Cancelled</span>
                            ) : (
                              <span className="text-green-500">Approved</span>
                            )}
                          </td>
                          {order.status === "confirmed" ? (
                            <td className="p-3">{order.ownerContact}</td>
                          ) : order.status === "cancelled" ? (
                            <td className="p-3 text-red-300">Unavailable</td>
                          ) : (
                            <td className="p-3">Pending...</td>
                          )}
                          <td className="p-3 text-nowrap">
                            {order.carId.location}
                          </td>
                          <td className="p-3 text-nowrap">
                            {order.carId.isRentedByBusiness}
                          </td>
                          <td className="p-3">
                            <Link
                              to={`/single_car_item/${order.carId._id}`}
                              className="w-full py-2 px-4 bg-white text-black mt-2 hover:text-black hover:bg-white rounded-lg"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
