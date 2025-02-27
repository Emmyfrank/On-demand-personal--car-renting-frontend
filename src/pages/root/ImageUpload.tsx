import { useState } from "react";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles];

      setImages(newImages);
      setPreviews(newImages.map((file) => URL.createObjectURL(file)));
      onImagesChange(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Images
      </label>{" "}
      {/* Smaller label, better contrast */}
      <input
        type="file"
        multiple
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer block w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300 text-center font-medium" // Updated button styling
      >
        Select Images
      </label>
      {/* Image Previews */}
      <div className="mt-3 flex flex-wrap gap-3">
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            {" "}
            {/* Added group for hover effect */}
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-24 h-24 object-cover rounded-md shadow-sm transition duration-300 group-hover:scale-105" // Added hover scale
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300" // Improved button styling and visibility
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
