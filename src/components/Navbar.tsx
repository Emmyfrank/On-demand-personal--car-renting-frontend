import { Link, useNavigate } from "react-router-dom";
import { INITIAL_USER, useUserContext } from "./AuthContext";
import { User2, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user, setUser, setIsAuthenticated } =
    useUserContext();
  const [drop, setDrop] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    const userConfirmed = window.confirm("Are you sure you want to log out?");
    if (userConfirmed) {
      setUser(INITIAL_USER);
      localStorage.removeItem("rental_token");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4">
      {/* Logo */}
      <Link to="/">
        <span className="text-3xl font-extrabold text-teal-600 cursor-pointer flex items-center space-x-2">
          {/* Logo Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="15" y2="15" />
            <line x1="9" y1="9" x2="9" y2="15" />
          </svg>

          {/* Text */}
          <span className="text-2xl font-extrabold text-white">CarRental</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/about" className="hover:text-gray-300 transition">
          About
        </Link>
        <Link to="/contact" className="hover:text-gray-300 transition">
          Contact
        </Link>

        {/* Conditional Buttons Based on Authentication */}
        {isAuthenticated ? (
          <>
            {/* Dashboard */}
            <Link to={`/dashboard/${user._id}`}>
              <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                Dashboard
              </button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2">
                <div className="bg-gray-600 flex items-center px-4 py-[4px] rounded-lg mr-4">
                  <div className="w-[35px] h-[35px] rounded-lg transition">
                    <img
                      src={user?.imageUrl}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover shrink-0"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogOut}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-700 bg-gray-700 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sign In & Sign Up */}
            <Link to="/sign-in">
              <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>

      <div className="flex md:hidden" onClick={() => setDrop(true)}>
        {isAuthenticated ? (
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            <User2 />
          </button>
        )}
      </div>

      {/* Mobile */}
      {drop && (
        <div className="md:hidden bg-white absolute top-[5rem] z-20 right-2 w-[90%] md:w-[400px] h-[30em] overflow-y-auto rounded-lg shadow-lg px-3">
          <div className="relative">
            <button
              onClick={() => setDrop(false)}
              className="bg-red-500 hover:bg-red-700 text-white rounded-full p-2 absolute right-1 top-2"
            >
              <X />
            </button>
          </div>
          <div className="flex flex-col items-center gap-6 py-6 mt-10">
            {/* Menu Links */}
            {/* <Link
              to="/cars"
              className="w-full md:w-[350px] text-center px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              Browse Cars
            </Link>
            <Link
              to="/about"
              className="w-full md:w-[350px] text-center px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="w-full md:w-[350px] text-center px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              Contact
            </Link> */}

            {/* Conditional Buttons Based on Authentication */}
            {isAuthenticated ? (
              <>
                {/* Dashboard */}
                <Link
                  to={`/dashboard/${user._id}`}
                  className="w-full md:w-[350px]"
                >
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    Dashboard
                  </button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group w-full md:w-[350px]">
                  <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300">
                    <div className="flex items-center gap-2">
                      <img
                        src={user?.imageUrl || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user?.fullname || "Profile"}</span>
                    </div>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-full md:w-40 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="block px-4 py-2 text-left w-full hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Sign In & Sign Up */}
                <Link to="/sign-in" className="w-full md:w-[350px]">
                  <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                    Sign In
                  </button>
                </Link>
                <Link to="/sign-up" className="w-full md:w-[350px]">
                  <button className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
