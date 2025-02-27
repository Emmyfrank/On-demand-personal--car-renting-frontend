import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import Onboarding from "./pages/root/onboarding";
import { useUserContext } from "@components/AuthContext";
import LoadingComponent from "@components/loadingComponent";
import MainDashboard from "./pages/root/Dashboard/MainDashboard";
import CreateUpload from "./pages/root/CreateUpload";
import HomePage from "./pages/root/HomePage";
import DetailPage from "./pages/DetailPage";
import About from "./pages/root/about";
import Contact from "./pages/root/contact";

export default function Home() {
  const { isLoading, loading } = useUserContext();
  if (isLoading || loading) {
    return <LoadingComponent />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/onboarding/:userId" element={<Onboarding />} />
      <Route path="/dashboard/:userId" element={<MainDashboard />} />
      <Route
        path="/create_upload_rent_your_car/:userId/:role"
        element={<CreateUpload />}
      />
      <Route path="/single_car_item/:id" element={<DetailPage />} />
    </Routes>
  );
}

//
// "build": "tsc -b && vite build",
