"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { $getRoot } from "lexical";
import "./style.css";
import { backgroundColor, initialConfig } from "./common";
import ToolbarPlugin from "./ToolbarPlugin";
import { baseurl, suburl } from "@/app/config";
import { TiDeleteOutline } from "react-icons/ti";
import { PiEmptyLight } from "react-icons/pi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import ImagesPreview from "./ImagesPreview";
import axios from "axios";
import { useStore } from "@/app/global/DataProvider";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useSocket } from "@/app/user/global/SocketProvider";
import imageCompression from "browser-image-compression";
export default function FacebookStyleEditor() {
  const { store, dispatch } = useStore();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [editorData, setEditorData] = useState('');
  const [selectedBg, setSelectedBg] = useState({ id: 3221 });
  const [detectedUrl, setDetectedUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSetBg, setIsSetBg] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const previousBgRef = useRef(null);

  // ✅ FIXED matcher (IMPORTANT)
  const URL_MATCHER = (text) => {
    const regex =
      /https?:\/\/(www\.)?[\w-]+\.[\w./?=#&%-]+/g;

    const match = regex.exec(text);
    if (!match) return null;

    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: match[0],
    };
  };


const [visibility, setVisibility] = useState("public");

const visibilityOptions = [
  {
    value: "self",
    label: "Self",
    description: "Only you can see this post",
    icon: "🔒",
  },
  {
    value: "friends",
    label: "Friends",
    description: "Only your friends can see this post",
    icon: "👥",
  },
  {
    value: "public",
    label: "Public",
    description: "Anyone can see this post",
    icon: "🌎",
  },
];

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));

    setImages([]);
    setIsLoading(true);

const options = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1080,
  initialQuality: 0.5,
  useWebWorker: false,
};

  const result = [];

  for (const file of files) {
    try {
      const compressed = await imageCompression(file, options);
      result.push(compressed);
    } catch {
      result.push(file);
    }

    // Update state after each image
    setImages([...result]);
  }

    setImagePreviews(result.map((file) => URL.createObjectURL(file)));
  
  setIsLoading(false);
  e.target.value = "";
  };


  useEffect(() => {
    if (text.length > 300) {
      // Save the user's current background only once
      if (selectedBg?.id !== 3221) {
        previousBgRef.current = selectedBg;
      }

      setSelectedBg({ id: 3221 });
    } else {
      // Restore the previous background
      if (selectedBg?.id === 3221) {
        setSelectedBg(previousBgRef.current);
      }
    }
  }, [text.length]);

  const fontSize = useMemo(() => {
    if (text.length < 50) {
      return "text-5xl font-bold";
    }
    if (text.length < 100) {
      return "text-4xl font-bold";
    }
    if (text.length < 250) {
      return "text-3xl font-bold";
    }

    if (text.length < 300) {
      // setIsSetBg(true)
      return "text-2xl"
    };
    // setIsSetBg(false)
    return "text-sm";
  }, [text]);

  const handleTextChange = (editorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      const plainText = $getRoot().getTextContent();
      setText(plainText);
      setEditorData(json);

      const urls = plainText.match(/https?:\/\/[^\s]+/gi);
      if (urls?.length) {
        const lastUrl = urls[urls.length - 1];

        if (lastUrl !== detectedUrl) {
          setDetectedUrl(lastUrl);
          fetchLinkPreview(lastUrl);
        }
      } else {
        setDetectedUrl(null);
        setPreview(null)
      }
    });
  };


  const fetchLinkPreview = async (url) => {
    if (isSetBg) return
    try {
      setIsPreviewLoading(true)
      const res = await fetch(
        `${suburl}/link-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();
      setPreview(data);
      setIsPreviewLoading(false)
    } catch (err) {
      console.error(err);
      setIsPreviewLoading(false)
    }
  };

  const handlePost = async () => {
    if (!editorData && images.length !== 0) {
      alert("Please repost again with new content.");
      return;
    }

    setIsLoading(true);

    try {
      const content = JSON.stringify(editorData);

      const formData = new FormData();

      formData.append("content", content);
      formData.append("text", text.slice(0, 50));
      formData.append("status", visibility);
    formData.append(
  "selectedBg",
  selectedBg ? JSON.stringify(selectedBg) : ""
);

  images.forEach((file) => {
  formData.append("images", file);
});

      const { data } = await axios.post(
        `${suburl}/userposts/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
              (progressEvent.total || 1)
            );

            console.log(`Upload: ${percent}%`);
          },
        }
      );

      setEditorData("");
      setImages([]);
      setIsLoading(false);
     dispatch({ type: "CLOSE_FEEDMAKER" })
      const res = await axios.post(
        `${baseurl}/notification/alert-to-all-friends-when-feed-added`,
        {
          pointerId: data._id,
          title: text.slice(0, 30),
          nearbyUsersId: store.nearbyUsersId,
          type: "post",
        },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      for (const item of res.data) {
        socket.emit("new-notification", item);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };


  return (
    <div>
      {
        (text.length > 10 || images.length > 0) && <div className="flex justify-end p-3">
          {
            !isLoading ? <button onClick={handlePost}
              className=" ml-auto
      px-5 py-1
      bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
      text-white font-semibold
      rounded-lg
      shadow-lg shadow-blue-500/25
      hover:scale-105 hover:shadow-xl
      active:scale-95
      transition-all duration-200
    "
            >
              Post
            </button> : <button
              className=" ml-auto
      px-5 py-1
      bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
      text-white font-semibold
      rounded-lg
      shadow-lg shadow-blue-500/25
      hover:scale-105 hover:shadow-xl
      active:scale-95
      transition-all duration-200
    "
            >
              Loading...
            </button>
          }
        </div>
      }
      <div className="relative border">
        <input id="3221" className="hidden"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <LexicalComposer initialConfig={initialConfig}> 
          <div className="flex gap-1 p-1">
    {visibilityOptions.map((option) => (
      <label
        key={option.value}
        className={`flex cursor-pointer items-center gap-1 rounded-xl border p-1 transition
          ${
            visibility === option.value
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }
        `}
      >
        <input
          type="radio"
          name="postVisibility"
          value={option.value}
          checked={visibility === option.value}
          onChange={(e) => setVisibility(e.target.value)}
          className="h-3 w-3 accent-blue-600"
        />

        <span className="text-sm">{option.icon}</span>

        <div>
          <p className="text-gray-800">
            {option.label}
          </p>
        </div>
      </label>
    ))}
  </div>
          <HistoryPlugin />
          <ToolbarPlugin />
          <TabIndentationPlugin />   {/* ✅ ADD HERE */}
          <div
            className={`w-full max-w-2xl h-[400px] overflow-hidden ${text.length > 300 ? "" : isSetBg == false ? '' : `${selectedBg.value}`
              }`}
          >
            <div className="relative w-full h-full p-4">
              <div
                className={`w-full h-full ${text.length > 300
                  ? "block overflow-y-auto hidden_scroll" : isSetBg == false ? "block overflow-y-auto hidden_scroll"
                    : "flex items-center justify-center"
                  }`}
              >
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable
                      className={`w-full outline-none bg-transparent whitespace-pre-wrap break-words ${text.length > 300
                        ? "text-left text-base text-black" : isSetBg == false ? 'text-left text-base text-black'
                          : `text-center text-white ${fontSize}`
                        }`}
                    />
                  }
                  placeholder={
                    isSetBg ? (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/70 text-center text-3xl md:text-5xl font-bold px-10">
                        What's on your mind?
                      </div>
                    ) : <div className="pointer-events-none text-gray-700 -mt-6">
                      What's on your mind?
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={handleTextChange} />

                {/* ✅ LINK SUPPORT */}
                <LinkPlugin />
                <ListPlugin />   {/* Add this */}
                <AutoLinkPlugin matchers={[URL_MATCHER]} />

                {/* background selector (unchanged) */}
                {
                  isPreviewLoading && <div className="flex w-full mt-10 justify-center items-center"><AiOutlineLoading3Quarters className="animate-spin" size={25} /></div>
                }

                {
                  imagePreviews && isSetBg == false && (<div className="mt-4"><ImagesPreview images={images} imagePreviews={imagePreviews} setImages={setImages} setImagePreviews={setImagePreviews} /></div>)
                }
                {preview && isSetBg == false && (
                  <div className="mt-4 border rounded-xl overflow-hidden bg-white relative">
                    <div onClick={() => setPreview(null)} className="absolute top-2 right-2 z-50 w-10 h-10 bg-black/40 flex justify-center items-center  rounded-full"><TiDeleteOutline size={25} color="white" /></div>
                    {preview.image && (
                      <img
                        src={preview.image}
                        alt={preview.title}
                        className="w-full h-52 object-cover"
                      />
                    )}

                    <div className="p-3">
                      <h3 className="font-semibold">
                        {preview.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {preview.description}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {preview.url}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </LexicalComposer>
        {text.length < 300 && (
          <div className="w-full overflow-x-auto border-t border-b py-3 px-2 flex items-center gap-1 bg-white">
            <button onClick={() => { setIsSetBg(false) }}
              className={`min-w-[42px] h-[42px] rounded-xl border-2 border-white shadow-md flex justify-center items-center`}><PiEmptyLight size={30} /></button>
            <label
              htmlFor="3221"
              className="cursor-pointer min-w-[42px] h-[42px] rounded-xl border-2 border-white shadow-md flex justify-center items-center "
            >
              <CiImageOn size={30} />
            </label>
            {backgroundColor.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { setSelectedBg(bg), setIsSetBg(true), setImages([]) }}
                className={`min-w-[42px] h-[42px] rounded-xl border-2 border-white shadow-md ${bg.value}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}