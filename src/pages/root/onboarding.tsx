import { endPoint, useUserContext } from "@components/AuthContext";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, setUser } = useUserContext();

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [contact, setContact] = useState<string>();
  const isAdmin = user.email === import.meta.env.VITE_ADMIN_EMAIL_ADDRESS;

  const [businessData, setBusinessData] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    tin: "",
    licenseUrl: "",
    licenseFile: null,
  });

  useEffect(() => {
    if (isAdmin) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleLicense = (e: any) => {
    const file = e.target.files[0];
    setBusinessData((prevData) => ({
      ...prevData,
      licenseUrl: URL.createObjectURL(file),
      licenseFile: file,
    }));
  };

  const handleOnboarding = async () => {
    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (user.role) {
      return alert("You already have a role");
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${endPoint}/auth/user/update_user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role,
          contact,
        }),
      });

      const data = await response.json();

      if (data) {
        setUser((prevData) => ({
          ...prevData,
          role: data.role,
        }));
        navigate(`/dashboard/${userId}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setError("An error occurred while completing onboarding.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (user.role) {
      return alert("You already have a role");
    }

    if (businessData.contact.length < 10) {
      setError("Contact number should be at least 10 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", businessData.name);
    formData.append("description", businessData.description);
    formData.append("location", businessData.location);
    formData.append("contact", businessData.contact);
    formData.append("tin", businessData.tin);
    formData.append("userId", user._id);
    formData.append("role", role);

    if (businessData.licenseFile) {
      formData.append("licenseFile", businessData.licenseFile);
    }

    try {
      const response = await fetch(`${endPoint}/root/business/create`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.business) return setError(data.message);

      if (data.business) {
        setUser((prevData) => ({
          ...prevData,
          role: "business",
        }));
        navigate(`/dashboard/${userId}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setError("An error occurred while completing onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-4 text-white">
          Select Your Role
        </h1>

        <div className="flex flex-col gap-4">
          <button
            className={`p-3 rounded-md ${
              role === "carOwner"
                ? "bg-blue-500 text-white"
                : "bg-gray-600 text-white"
            }`}
            onClick={() => setRole("carOwner")}
          >
            🚗 I am a Car Owner
          </button>

          <button
            className={`p-3 rounded-md ${
              role === "business"
                ? "bg-blue-500 text-white"
                : "bg-gray-600 text-white"
            }`}
            onClick={() => setRole("business")}
          >
            🏢 I am a Company
          </button>
        </div>

        {role === "carOwner" && (
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Contact
              </label>
              <input
                type="number"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your contact number"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center mt-4">
                {error}
              </p>
            )}

            <button
              onClick={handleOnboarding}
              disabled={loading}
              className="w-full p-3 mt-6 bg-green-500 text-white rounded-md"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        )}

        {role === "business" && (
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                value={businessData.name}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your business name"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={businessData.description}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter a description for your business"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={businessData.location}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your business location"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Contact
              </label>
              <input
                type="number"
                name="contact"
                value={businessData.contact}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your contact number"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Tin
              </label>
              <input
                type="text"
                name="tin"
                value={businessData.tin}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white"
                placeholder="Enter your tin number"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                License
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLicense}
                className="w-full p-2 mt-1 border rounded-md bg-gray-700 text-white object-contain"
              />

              {businessData.licenseUrl && (
                <div className="mt-2">
                  <img
                    src={businessData.licenseUrl}
                    alt="License"
                    className="w-full object-cover h-48 rounded-lg"
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center mt-4">
                {error}
              </p>
            )}

            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full p-2 mt-2 bg-blue-600 text-white rounded-md"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
