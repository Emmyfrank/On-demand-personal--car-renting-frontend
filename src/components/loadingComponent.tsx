import { Loader2 } from "lucide-react";
const LoadingComponent = () => {
  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center pt-20">
      <img
        src="/image-removebg-preview.png"
        alt="image-logo"
        className="w-fit h-[400px] object-cover"
      />
      <Loader2 size={20} className="animate-spin mt-10" />
    </div>
  );
};

export default LoadingComponent;
