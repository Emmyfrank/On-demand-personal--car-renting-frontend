import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { useNavigate, useParams } from "react-router-dom";
import { endPoint } from "@components/AuthContext";
import { Image } from "lucide-react";
const CreateUpload = () => {
  const { userId, role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    images: [] as File[],
    description: "",
    availableUntil: "",
    userId: userId,
    role: role,
    location: "",
    insuranceUrl: "",
    insuranceFile: null,
    yellowCardUrl: "",
    yellowCardFile: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInsuranceFile = (e: any) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      insuranceFile: file,
      insuranceUrl: URL.createObjectURL(file),
    }));
  };
  const handleYellowCaFile = (e: any) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      yellowCardFile: file,
      yellowCardUrl: URL.createObjectURL(file),
    }));
  };

  const handleImagesChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Final API URL:", `${endPoint}/root/cars/create`);

    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        (value as File[]).forEach((file) => form.append("images", file));
      } else if (key === "location") {
        // Ensure location is sent as a string
        form.append(
          "location",
          Array.isArray(value) ? value.join(", ") : String(value)
        );
      } else {
        form.append(key, String(value));
      }
    });

    if (formData.insuranceFile) {
      form.append("insuranceFile", formData.insuranceFile);
    }

    if (formData.yellowCardFile) {
      form.append("yellowCardFile", formData.yellowCardFile);
    }

    try {
      const response = await fetch(`${endPoint}/root/cars/create`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (!data.car) return setError(data.message);
      navigate(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Error uploading car:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/80 h-fit w-full py-5">
      <div className="max-w-3xl mx-auto p-8 bg-slate-700 rounded-xl shadow-lg overflow-hidden">
        {" "}
        {/* Modernized container */}
        <h2 className="text-xl font-bold mb-6 text-center text-gray-200">
          {" "}
          {/* Slightly smaller heading */}
          Upload a Car
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {/* Reduced spacing */}
          {/* Input fields - shared styling */}
          {["brand", "model", "year", "pricePerDay"].map((field) => (
            <input
              key={field}
              type={
                field === "year" || field === "pricePerDay" ? "number" : "text"
              }
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)} // Capitalized placeholder
              className="bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onChange={handleChange}
              required
            />
          ))}
          {/* Image Upload */}
          <ImageUpload onImagesChange={handleImagesChange} />
          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            className="bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 h-24 resize-none" // Added resize-none
            onChange={handleChange}
            required
          ></textarea>
          {/* Date and Selects - shared styling */}
          {["availableUntil", "transmission", "fuelType"].map((field) => (
            <div key={field} className="relative">
              {" "}
              {/* For icon positioning */}
              {field === "availableUntil" ? (
                <input
                  type="datetime-local"
                  name={field}
                  className="bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  onChange={handleChange}
                  required
                />
              ) : (
                <select
                  name={field}
                  className="bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md appearance-none pr-8 focus:ring-2 focus:ring-blue-500 transition-all duration-300" // Added appearance-none and padding
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select {field.charAt(0).toUpperCase() + field.slice(1)}
                  </option>
                  {field === "transmission" ? (
                    <>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </>
                  ) : (
                    <>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </>
                  )}
                </select>
              )}
            </div>
          ))}
          <div>
            <input
              type="location"
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          {/* Insurance */}
          <div>
            <label htmlFor="insurance">
              <div className="flex items-center justify-center cursor-pointer gap-5 bg-slate-700 hover:bg-blue-900 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                <Image />
                <p>Upload insurance</p>
              </div>
            </label>
            <input
              type="file"
              id="insurance"
              className="hidden"
              required
              onChange={handleInsuranceFile}
            />
            {formData.insuranceUrl && (
              <img
                src={formData.insuranceUrl}
                alt="User Image"
                className="w-1/2 h-32 rounded-lg object-cover mt-2 mx-2"
              />
            )}
          </div>
          {/* Yellow card */}
          <div>
            <label htmlFor="yellow">
              <div className="hover:bg-blue-900 flex items-center justify-center cursor-pointer gap-5 bg-slate-700 text-white w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                <Image />
                <p>Upload yellow card</p>
              </div>
            </label>
            <input
              type="file"
              id="yellow"
              className="hidden"
              required
              onChange={handleYellowCaFile}
            />
            {formData.yellowCardUrl && (
              <img
                src={formData.yellowCardUrl}
                alt="User Image"
                className="w-1/2 h-32 rounded-lg object-cover mt-2 mx-2"
              />
            )}
          </div>
          {error && (
            <div className="w-full text-white text-xl py-10 text-center bg-red-700">
              {error}
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition-all duration-300" // Simplified button styling
          >
            {loading ? "Uploading..." : "Upload Car"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUpload;
