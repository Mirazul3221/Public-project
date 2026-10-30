import moment from "moment";
  const openImage = (i,setIndex,setOpen) => {
    setIndex(i);
    setOpen(true);
  };

 export const renderImage = (src, i, className,setIndex,setOpen) => (
    <img
      key={i}
      src={src}
      alt=""
      className={`${className} cursor-pointer`}
      onClick={() => openImage(i,setIndex,setOpen, )}
    />
  );


  export const renderImages = (count,totalImageCount,images,setIndex,setOpen) => {
      if (count === 1) {
        return (
          <div className="grid grid-cols-1">
            {renderImage(
              images[0],
              0,
              "w-auto h-[400px] rounded-lg mx-auto",
              setIndex,
              setOpen,
            )}
          </div>
        );
      }
  
      if (count === 2) {
        return (
          <div className="grid grid-cols-2  gap-[2px]">
            {images && images?.map((img, i) =>
              renderImage(
                img,
                i,
                "w-full h-[400px] object-cover rounded",
                setIndex,
                setOpen,
                  
              )
            )}
          </div>
        );
      }
  
      if (count === 3) {
        return (
          <div className="grid grid-cols-2  gap-[2px]">
            <div>
              {renderImage(
                images[0],
                0,
                "w-full h-[400px] object-cover rounded",
                setIndex,
                setOpen,  
              )}
            </div>
  
            <div className="grid  gap-[2px]">
              {renderImage(
                images[1],
                1,
                "w-full h-[200px] object-cover rounded",
                setIndex,
                setOpen, 
              )}
  
              {renderImage(
                images[2],
                2,
                "w-full h-[200px] object-cover rounded",
                setIndex,
                setOpen,  
              )}
            </div>
          </div>
        );
      }
  
      if (count === 4) {
        return (
          <div className="grid grid-cols-2  gap-[2px]">
            {images && images?.map((img, i) =>
              renderImage(
                img,
                i,
                "w-full h-[250px] object-cover rounded",
                setIndex,
                setOpen,   
              )
            )}
          </div>
        );
      }
      
      return (
        <div className="space-y-[2px]">
          <div className="grid grid-cols-2  gap-[2px]">
            {images && images?.slice(0, 2).map((img, i) =>
              renderImage(
                img,
                i,
                "w-full h-[250px] object-cover rounded",
                setIndex,
                setOpen, 
              )
            )}
          </div>
  
          <div className="grid grid-cols-3  gap-[2px]">
  
            {images && images?.slice(2).map((img, i) => (
              <div onClick={() => openImage(i + 2,setIndex,setOpen, )} key={i} className="relative cursor-pointer">
                <img
                  src={img}
                  alt=""
                  className="w-full h-[180px] object-cover rounded"
                />
                {i === 2 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                    <span className="text-white text-4xl font-bold">
                      +{totalImageCount - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };




 export const formatRelativeTime = function (timestamp) {
    const now = moment(); // Current time
    const createdAt = moment(timestamp); // Parse the createdAt timestamp
    const duration = moment.duration(now.diff(createdAt)); // Calculate duration

    if (duration.asMinutes() < 1) {
      return `${Math.floor(duration.asSeconds())}s`; // Less than a minute, show in seconds
    } else if (duration.asHours() < 1) {
      return `${Math.floor(duration.asMinutes())}m`; // Less than an hour, show in minutes
    } else if (duration.asDays() < 1) {
      return `${Math.floor(duration.asHours())}h`; // Less than a day, show in hours
    } else {
      return `${Math.floor(duration.asDays())}d`; // More than a day, show in days
    }
  }

 export const background_color = [
  {
    id: 1,
    value: "linear-gradient(135deg,#ff00cc,#3333ff)",
  },
  {
    id: 2,
    value: "linear-gradient(135deg,#ff512f,#dd2476)",
  },
  {
    id: 3,
    value: "linear-gradient(135deg,#141E30,#243B55)",
  },
  {
    id: 4,
    value: "linear-gradient(135deg,#7F00FF,#E100FF)",
  },
  {
    id: 5,
    value: "linear-gradient(135deg,#f7971e,#ffd200)",
  },
  {
    id: 6,
    value: "linear-gradient(135deg,#000000,#434343)",
  },
  {
    id: 7,
    value: "linear-gradient(135deg,#00c6ff,#0072ff)",
  },
  {
    id: 8,
    value: "linear-gradient(135deg,#f953c6,#b91d73)",
  },
  {
    id: 9,
    value: "linear-gradient(135deg,#43cea2,#185a9d)",
  },
  {
    id: 10,
    value: "linear-gradient(135deg,#ff9966,#ff5e62)",
  },
  {
    id: 11,
    value: "linear-gradient(135deg,#56ab2f,#a8e063)",
  },
  {
    id: 12,
    value: "linear-gradient(135deg,#614385,#516395)",
  },
  {
    id: 13,
    value: "linear-gradient(135deg,#e65c00,#f9d423)",
  },
  {
    id: 14,
    value: "linear-gradient(135deg,#02aab0,#00cdac)",
  },
  {
    id: 15,
    value: "linear-gradient(135deg,#fc466b,#3f5efb)",
  },
  {
    id: 16,
    value: "linear-gradient(135deg,#00f260,#0575e6)",
  },
  {
    id: 17,
    value: "linear-gradient(135deg,#ff0844,#ffb199)",
  },
  {
    id: 18,
    value: "linear-gradient(135deg,#654ea3,#eaafc8)",
  },
  {
    id: 19,
    value: "linear-gradient(135deg,#2193b0,#6dd5ed)",
  },
  {
    id: 20,
    value: "linear-gradient(135deg,#cc2b5e,#753a88)",
  },
  {
    id: 21,
    value: "linear-gradient(135deg,#42275a,#734b6d)",
  },
  {
    id: 22,
    value: "linear-gradient(135deg,#bdc3c7,#2c3e50)",
  },
  {
    id: 23,
    value: "linear-gradient(135deg,#de6262,#ffb88c)",
  },
  {
    id: 24,
    value: "linear-gradient(135deg,#06beb6,#48b1bf)",
  },
  {
    id: 25,
    value: "linear-gradient(135deg,#eb3349,#f45c43)",
  },
  {
    id: 26,
    value: "linear-gradient(135deg,#dd5e89,#f7bb97)",
  },
  {
    id: 27,
    value: "linear-gradient(135deg,#56ccf2,#2f80ed)",
  },
  {
    id: 28,
    value: "linear-gradient(135deg,#c94b4b,#4b134f)",
  },
  {
    id: 29,
    value: "linear-gradient(135deg,#373b44,#4286f4)",
  },
  {
    id: 30,
    value: "linear-gradient(135deg,#ff6a00,#ee0979)",
  },
  {
    id: 31,
    value: "linear-gradient(135deg,#11998e,#38ef7d)",
  },
  {
    id: 32,
    value: "linear-gradient(135deg,#fc4a1a,#f7b733)",
  },
  {
    id: 33,
    value: "linear-gradient(135deg,#7f00ff,#e100ff)",
  },
  {
    id: 34,
    value: "linear-gradient(135deg,#00b09b,#96c93d)",
  },
  {
    id: 35,
    value: "linear-gradient(135deg,#ff758c,#ff7eb3)",
  },
  {
    id: 36,
    value: "linear-gradient(135deg,#1f4037,#99f2c8)",
  },
  {
    id: 37,
    value: "linear-gradient(135deg,#fc5c7d,#6a82fb)",
  },
  {
    id: 38,
    value: "linear-gradient(135deg,#ff416c,#ff4b2b)",
  },
  {
    id: 39,
    value: "linear-gradient(135deg,#3a1c71,#d76d77,#ffaf7b)",
  },
  {
    id: 40,
    value: "linear-gradient(135deg,#8360c3,#2ebf91)",
  },
  {
    id: 41,
    value: "linear-gradient(135deg,#ff0099,#493240)",
  },
  {
    id: 42,
    value: "linear-gradient(135deg,#4e54c8,#8f94fb)",
  },
  {
    id: 43,
    value: "linear-gradient(135deg,#ff512f,#f09819)",
  },
  {
    id: 44,
    value: "linear-gradient(135deg,#24c6dc,#514a9d)",
  },
  {
    id: 45,
    value: "linear-gradient(135deg,#e96443,#904e95)",
  },
  {
    id: 46,
    value: "linear-gradient(135deg,#232526,#414345)",
  },
  {
    id: 47,
    value: "linear-gradient(135deg,#4568dc,#b06ab3)",
  },
  {
    id: 48,
    value: "linear-gradient(135deg,#43c6ac,#191654)",
  },
  {
    id: 49,
    value: "linear-gradient(135deg,#ff4e50,#f9d423)",
  },
  {
    id: 50,
    value: "linear-gradient(135deg,#30cfd0,#330867)",
  },
];