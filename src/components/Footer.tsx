import { Facebook, Instagram, Linkedin, Twitch } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold">CarRental</h2>
            <p className="mt-2 text-gray-400">
              The best platform to rent and list cars easily.
            </p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-gray-300">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <Link
                to="https://facebook.com"
                target="_blank"
                className="hover:text-blue-500"
              >
                <Facebook size={24} />
              </Link>
              <Link
                to="https://instagram.com"
                target="_blank"
                className="hover:text-pink-500"
              >
                <Instagram size={24} />
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                className="hover:text-blue-400"
              >
                <Twitch size={24} />
              </Link>
              <Link
                to="https://linkedin.com"
                target="_blank"
                className="hover:text-blue-600"
              >
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          © {new Date().getFullYear()} CarRental. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
