import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert("We will reach to you soon!");
    navigate("/");
  };
  return (
    <div className="w-full h-screen overflow-y-auto bg-black text-white">
      <div className="w-[600px] mx-auto pt-20 text-xl">
        <h1>Contact Us</h1>
        <p>
          We’d love to hear from you! Whether you have a question about our
          services, need assistance with a booking, or simply want to share your
          experience with us, we are here to help.
        </p>
        <br />
        <p>You can reach us through the following ways:</p>
        <br />

        <div>
          <h2 className="text-lg font-semibold">Phone:</h2>
          <p>(+250) 781705734</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Email:</h2>
          <p>support@ondemandcarrental.com</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Address:</h2>
          <p>123 Car Rental Blvd, nyamata 100, Kigali, Kimihurura, 00000</p>
        </div>
        <br />

        <p>
          Alternatively, you can fill out the contact form below, and we’ll get
          back to you as soon as possible.
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactData.name}
              onChange={handleChange}
              className="w-full p-2 text-white rounded-lg bg-slate-800"
              placeholder="Your Name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={contactData.email}
              className="w-full p-2 text-white rounded-lg bg-slate-800"
              placeholder="Your Email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-300">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={contactData.message}
              onChange={handleChange}
              className="w-full p-2 text-white rounded-lg bg-slate-800"
              rows={4}
              placeholder="Your Message"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={
              !contactData.message || !contactData.message || !contactData.email
            }
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
          >
            Send Message
          </button>
        </form>

        <br />
        <p className="mb-5">
          Our customer support team is available 24/7 to assist you with any
          inquiries.
        </p>
      </div>
    </div>
  );
};

export default Contact;
