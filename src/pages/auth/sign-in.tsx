import { endPoint, useUserContext } from "@components/AuthContext";
import { Loader } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [userData, setUserdata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setUser, setIsAuthenticated, isAuthenticated, user } =
    useUserContext();

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
      if (!userData.password) return setError("Please enter a password");
      if (!userData.email) return setError("Please enter a email");

      const response = await fetch(`${endPoint}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!data.token) return setError(data.message);
      if (data.token) localStorage.removeItem("rental_token");
      if (data.token) localStorage.setItem("rental_token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate(`/dashboard/${data.user._id}`);
    } catch (error) {
      console.log(error);
      setError("An error occurred while signing in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user._id) {
      navigate("/"); // Redirect to the homepage if the user is authenticated
    }
  }, [isAuthenticated, user._id, navigate]);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white py-5 px-5">
        <div className="w-full max-w-4xl flex items-center shadow-lg rounded-lg overflow-hidden bg-gray-800">
          {/* Image Section */}
          <div className="hidden sm:flex w-1/2">
            <img
              src="https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Car Image"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Form Section */}
          <div className="w-full sm:w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                />
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
                  "Sign In"
                )}
              </button>
            </form>

            <div>
              <p className="text-sm text-center text-gray-300 mt-4">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Sign Up
                </Link>
              </p>
              <p className="text-sm text-center text-gray-300 mt-2">
                Forgot Password? <a href="#">Reset Password</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
