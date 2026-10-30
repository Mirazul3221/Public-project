import React from "react";
import { IoClose } from "react-icons/io5";

const ImagesPreview = ({
  images,
  imagePreviews,
  setImages,
  setImagePreviews,
}) => {
  if (!imagePreviews.length) return null;

  const removeImage = (index) => {
    const newFiles = [...images];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const DeleteButton = ({ index }) => (
    <button
      onClick={() => removeImage(index)}
      className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
    >
      <IoClose size={20} />
    </button>
  );

  // 1 IMAGE
  if (imagePreviews.length === 1) {
    return (
      <div className="relative">
        <img
          src={imagePreviews[0]}
          alt=""
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <DeleteButton index={0} />
      </div>
    );
  }

  // 2 IMAGES
  if (imagePreviews.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {imagePreviews.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt=""
              className="h-[400px] w-full object-cover"
            />
            <DeleteButton index={index} />
          </div>
        ))}
      </div>
    );
  }

  // 3 IMAGES
  if (imagePreviews.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1">
        <div className="relative">
          <img
            src={imagePreviews[0]}
            alt=""
            className="h-[400px] w-full object-cover"
          />
          <DeleteButton index={0} />
        </div>

        <div className="grid gap-1">
          <div className="relative">
            <img
              src={imagePreviews[1]}
              alt=""
              className="h-[200px] w-full object-cover"
            />
            <DeleteButton index={1} />
          </div>

          <div className="relative">
            <img
              src={imagePreviews[2]}
              alt=""
              className="h-[200px] w-full object-cover"
            />
            <DeleteButton index={2} />
          </div>
        </div>
      </div>
    );
  }

  // 4 IMAGES
  if (imagePreviews.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {imagePreviews.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt=""
              className="h-[250px] w-full object-cover"
            />
            <DeleteButton index={index} />
          </div>
        ))}
      </div>
    );
  }

  // 5+ IMAGES
  return (
    <div className="grid grid-cols-2 gap-1">
      {imagePreviews.slice(0, 4).map((img, index) => (
        <div key={index} className="relative">
          <img
            src={img}
            alt=""
            className="h-[200px] w-full object-cover"
          />

          <DeleteButton index={index} />

          {index === 3 && imagePreviews.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-4xl font-bold">
              +{imagePreviews.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagesPreview;