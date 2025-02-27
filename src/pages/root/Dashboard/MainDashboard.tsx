import { endPoint, useUserContext } from "@components/AuthContext";
import { Link } from "react-router-dom";
import CarOwnerDashboard, { ICar } from "./CarOwnerDashboard";
import BusinessDashboard from "./BusinessDashboard";
import AdminDashboard, { IBusiness } from "./AdminDashboard";
import { Button } from "@components/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingComponent from "@components/loadingComponent";

const MainDashboard = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<ICar[]>([]);
  const [business, setBusiness] = useState<IBusiness[]>([]);
  const [businesses, setBusinesses] = useState([]);
  const [businessName, setBusinessName] = useState();
  const [businessDeclineReason, setBusinessDeclineReason] = useState();
  const isAdmin = user.email === import.meta.env.VITE_ADMIN_EMAIL_ADDRESS;

  const token = localStorage.getItem("rental_token");
  const userWithData = async () => {
    try {
      const response = await fetch(`${endPoint}/auth/user/get_session_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCars(data.user.car);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const adminWithData = async () => {
    try {
      const response = await fetch(`${endPoint}/root/cars/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const currentDate = new Date();

      const filteredData = data.cars.filter((item: ICar) => {
        const availableUntilDate = new Date(item.availableUntil);
        return availableUntilDate >= currentDate;
      });
      setCars(filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const adminWithDataBusiness = async () => {
    try {
      const response = await fetch(`${endPoint}/root/business/get`, {
        method: "GET",
      });
      const data = await response.json();
      setBusinesses(data.businesses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const businessWithData = async () => {
    try {
      const response = await fetch(
        `${endPoint}/root/business/get/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setBusiness(data.business);
      setBusinessName(data.business.name);
      setBusinessDeclineReason(data.business.declineReason);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === "carOwner") {
      userWithData();
    } else if (isAdmin) {
      adminWithData();
      adminWithDataBusiness();
    } else if (user.role === "business") {
      businessWithData();
    }
  }, [user.role]);

  // useEffect(() => {
  //   if (user && !user.email) navigate("/");
  // }, [user.email]);
  if (loading) return <LoadingComponent />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Welcome, {user.fullname}!</h1>
        <p className="text-gray-300 mt-2">This is your main dashboard page.</p>

        {/* User Details */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <p>
            <span className="capitalize font-bold">
              {user.role === "business" ? businessName : user.fullname}
            </span>
          </p>
          {user.role === "carOwner" && (
            <p className="text-white text-xs">
              {user.role === "carOwner" && "Car owner"}
            </p>
          )}
          {user.role === "business" && (
            <p className="text-white text-xs">
              {user.role === "business" && "Company"}
            </p>
          )}
          {isAdmin && <p className="text-white text-xs">Admin</p>}
          <div className="mt-4">
            <img
              src={user.imageUrl}
              alt={user.fullname}
              className="w-20 h-20 rounded-full mt-2 shadow-lg border border-gray-700"
            />
          </div>
        </div>

        {/* Navigation Links */}
        {user.role === "carOwner" && (
          <div className="mt-6 flex gap-4">
            <Link
              to="/profile"
              className="hidden md:flex px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
            >
              Profile
            </Link>
            <Link
              to="/logout"
              className="hidden md:flex px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
            >
              Logout
            </Link>
            <Link to={`/create_upload_rent_your_car/${user._id}/${user.role}`}>
              <Button className="bg-white text-black font-bold capitalize hover:bg-white">
                <Plus className="w-10 h-10 hover:rotate-45 transition-all duration-100 ease-in-out" />
                <span>add you car right here</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Role-based Dashboard */}
        <div className="mt-6">
          {user.role == "carOwner" && (
            <CarOwnerDashboard cars={cars} setCars={setCars} />
          )}
          {user.role === "business" && (
            <BusinessDashboard
              cars={business}
              businessDeclineReason={
                businessDeclineReason && businessDeclineReason
              }
            />
          )}
          {isAdmin && (
            <AdminDashboard
              cars={cars}
              setCars={setCars}
              businesses={businesses}
              setBusinesses={setBusinesses}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
