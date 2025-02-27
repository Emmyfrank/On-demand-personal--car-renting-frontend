import { endPoint, useUserContext } from "@components/AuthContext";
import CarCard from "@components/CardComponent";
import { carBrands, testimonials } from "@components/data/dammyData";
import { useEffect, useState } from "react";
import { ICar } from "./Dashboard/CarOwnerDashboard";
import { Link } from "react-router-dom";

export interface ICarCard {
  availableUntil: string;
  brand: string;
  businessId: string;
  description: string;
  fuelType: string;
  images: string;
  isApproved: string;
  isRentedByBusiness: string;
  model: string;
  ownerId: string;
  pricePerDay: string;
  transmission: string;
  year: string;
  _id: string;
}

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUserContext();

  useEffect(() => {
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
          return (
            car.isApproved === true &&
            availableUntilDate >= currentDate &&
            car.isRentedByBusiness === false
          );
        });

        setFeaturedCars(filteredData);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <section
          className="relative h-[500px] flex flex-col items-center justify-center bg-cover bg-center text-center text-white opacity-8"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg')",
          }}
        >
          <h1 className="text-5xl font-bold">Find Your Perfect Ride</h1>
          <p className="text-lg mt-4">
            Browse thousands of cars at the best prices.
          </p>
          {/* <SearchBar /> */}
        </section>

        {/* Car Categories */}
        <section className="py-10 px-5">
          <h2 className="text-3xl font-semibold text-center">
            Get top Car Brand
          </h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {carBrands.map((brand, index) => (
              <div
                key={index}
                className="brand-card bg-gray-400 p-4 rounded-lg text-center"
              >
                <img
                  src={brand.image} // Dynamically set the image from the object
                  alt={brand.name} // Dynamically set the alt text
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-xl font-semibold text-black">
                  {brand.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Cars */}
        <section className="py-10">
          <h2 className="text-3xl font-semibold text-center">Featured Cars</h2>
          {loading ? (
            <p className="text-center">Loading featured cars...</p>
          ) : featuredCars.length === 0 ? (
            <p className="text-xl text-center mt-10">No posts for now</p>
          ) : (
            <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
              {featuredCars.map((car: ICarCard) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center">
              🚗 What Our Customers Say
            </h2>
            <p className="text-lg text-center text-gray-300 mt-2">
              Hear from satisfied customers who found their perfect ride!
            </p>

            {/* Testimonials Grid */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg"
                >
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section
          className="relative h-[500px] flex flex-col items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl px-6">
            <h2 className="text-4xl font-bold">
              Find the Perfect Ride or List Your Car
            </h2>
            <p className="mt-4 text-lg">
              Whether you need a car for your next trip or want to earn by
              renting yours, we make it easy!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="#"
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Browse Cars
              </Link>
              {user.email ? (
                user.role === "carOwner" ? (
                  <Link
                    to={`/dashboard/${user._id}`}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    List Your Car
                  </Link>
                ) : (
                  <Link
                    to={`/dashboard/${user._id}`}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    Visit your dashboard
                  </Link>
                )
              ) : (
                <Link
                  to="/sign-in"
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                  List Your Car
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
