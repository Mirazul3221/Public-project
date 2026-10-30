import React, { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import CommentBox from "./CommentBox";

const ImageCard = ({ myImage, postAfterDelete, Handler = null, onNavigate, builderFlug }) => {
    const images = myImage?.previewImages || [];

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const openImage = (i) => {
        setIndex(i);
        setOpen(true);
    };

    const renderImage = (src, i, className) => (
        <img
            key={i}
            src={src}
            alt=""
            className={`${className} cursor-pointer`}
            onClick={() => openImage(i)}
        />
    );

    const count = images.length;

    const renderImages = () => {
        if (count === 1) {
            return (
                <div className="grid grid-cols-1">
                    {renderImage(
                        images[0],
                        0,
                        "w-full h-[500px] object-cover rounded-lg"
                    )}
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="grid grid-cols-2 gap-1">
                    {images.map((img, i) =>
                        renderImage(
                            img,
                            i,
                            "w-full h-[400px] object-cover rounded"
                        )
                    )}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="grid grid-cols-2 gap-1">
                    <div>
                        {renderImage(
                            images[0],
                            0,
                            "w-full h-[400px] object-cover rounded"
                        )}
                    </div>

                    <div className="grid gap-1">
                        {renderImage(
                            images[1],
                            1,
                            "w-full h-[200px] object-cover rounded"
                        )}

                        {renderImage(
                            images[2],
                            2,
                            "w-full h-[200px] object-cover rounded"
                        )}
                    </div>
                </div>
            );
        }

        if (count === 4) {
            return (
                <div className="grid grid-cols-2 gap-1">
                    {images.map((img, i) =>
                        renderImage(
                            img,
                            i,
                            "w-full h-[250px] object-cover rounded"
                        )
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-1">
                {images.slice(0, 4).map((img, i) => (
                    <div
                        key={i}
                        className="relative cursor-pointer"
                        onClick={() => openImage(i)}
                    >
                        <img
                            src={img}
                            alt=""
                            className="w-full h-[250px] object-cover rounded"
                        />

                        {i === 3 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                                <span className="text-white text-4xl font-bold">
                                    +{count - 4}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };


    

    return (
        <div className="">
            {renderImages()}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                plugins={[Zoom]}
                slides={images.map((img) => ({
                    src: img,
                }))}
            />

            <div className="mt-2 duration-300">
                <CommentBox feed={myImage} Handler={Handler} onNavigate={onNavigate} builderFlug={builderFlug} />
            </div>
        </div>
    );
};

export default ImageCard;