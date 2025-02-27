import { endPoint, useUserContext } from "@components/AuthContext";
import { Loader } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userData, setUserdata] = useState({
    fullname: "",
    email: "",
    password: "",
    imageUrl: "",
    imageFile: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setIsAuthenticated, user, isAuthenticated } =
    useUserContext();

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserdata((prevData) => ({
        ...prevData,
        imageUrl: URL.createObjectURL(file),
        imageFile: file,
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!userData.fullname) return setError("Please enter a fullname");
      if (!userData.email) return setError("Please enter an email");
      if (!userData.password) return setError("Please enter a password");
      if (!userData.imageFile) return setError("Please enter an image file");

      const formData = new FormData();
      formData.append("fullname", userData.fullname);
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      if (userData.imageFile) {
        formData.append("imageFile", userData.imageFile);
      }

      localStorage.removeItem("rental_token");

      const response = await fetch(`${endPoint}/auth/user/register`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        return setError("User already exists");
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.token) return setError(data.message);
      if (data.token) {
        localStorage.removeItem("rental_token");
        localStorage.setItem("rental_token", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        navigate(`/onboarding/${data.user._id}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user.role) {
      navigate("/"); // Redirect to the homepage if the user is authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white py-5 px-5">
        <div className="w-full max-w-4xl flex items-center shadow-lg rounded-lg overflow-hidden bg-gray-800">
          {/* Form Section */}
          <div className="w-full sm:w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6">Create an Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={userData.fullname}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
                {userData.imageUrl && (
                  <img
                    src={userData.imageUrl}
                    alt="User Image"
                    className="w-24 h-32 rounded-lg object-cover mt-2 mx-2"
                  />
                )}
              </div>
              {error && (
                <div className="w-full text-white text-xl py-10 text-center bg-red-700">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4"
              >
                {loading ? (
                  <Loader className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div>
              <p className="text-sm text-center text-gray-300 mt-4">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
          {/* Image Section */}
          <div className="hidden sm:flex w-1/2">
            <img
              src="https://images.pexels.com/photos/30727798/pexels-photo-30727798/free-photo-of-luxury-bmw-car-parked-on-a-sunny-day.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Car Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
