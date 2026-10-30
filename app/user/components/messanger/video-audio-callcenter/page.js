"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import storeContext from "@/app/global/createContex";
import { useSocket } from "@/app/user/global/SocketProvider";
import MyVideoStream from "./MyVideoStream";
import { LuScreenShare } from "react-icons/lu";
import { LuScreenShareOff } from "react-icons/lu";
import { IoVideocamOffOutline } from "react-icons/io5";
import { GoDeviceCameraVideo } from "react-icons/go";
import { IoCameraOutline } from "react-icons/io5";
import { IoCameraReverseOutline } from "react-icons/io5";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { MdCallEnd } from "react-icons/md";
import { visualEffect } from "./audioVisualizer";
import { ImSpinner10 } from "react-icons/im";
import {
  backVideStream,
  callStartKey,
  checkBackCamera,
  checkPermissionStatus,
  createAnswer,
  frontVideStream,
  generateStream,
  prepareMediaAndStart,
  rtConfig,
  setRemoteAns,
} from "./common/app";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";
const Page = () => {
  const data = useSearchParams();
   const [localStream, setLocalStream] = useState(null);
  const [myFace, setMyFace] = useState(true);
  const [isRing, setIsRing] = useState(true);
  const [isBackcameraExist, setIsBackcameraExist] = useState(false);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [callAlert, setCallAlert] = useState("local");
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const [attached,setAttached] = useState(false)
  const [toggleMick, setToggleMick] = useState(false);
  const [toggleStream, setToggleStream] = useState(false);
  const [faceVideoMove, setFaceVideoMove] = useState(true);
  const { store } = useContext(storeContext);
  const myId = data.get("my_peear");
  const fdId = data.get("friend_peear");
  const name = data.get("name");
  const profile = data.get("profile");
  const type = data.get("type");
  const action = data.get("action");
  const [callInv, setCallInv] = useState(action);
  const { socket } = useSocket();
  const myStream = useRef(null);
  const pcRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const remoteVideo = useRef(null);
  const remoteAudio = useRef(null);
  const canvRef = useRef(null);
  const exchangeLocalStream = useRef(null);
  const exchangeRemoteStream = useRef(null);
  const pendingOffer = useRef(null);
  const isMediaReady = useRef(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  /////////////////////////////Here close tab logic/////////////////////////////////
  useEffect(() => {
    const onTabClose = () => {
      socket.emit("end-call", {
        id: fdId,
        end: "call-end",
      });
    };

    window.addEventListener("beforeunload", onTabClose);

    return () => {
      window.removeEventListener("beforeunload", onTabClose);
    };
  }, [socket]);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////webRTC logic start from here/////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////webRTC logic start from here/////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const CreatePeearConnection = useCallback(
    async (stm) => {
      const rtc = new RTCPeerConnection(rtConfig);
      stm?.getTracks().forEach((track) => {
        rtc.addTrack(track, stm);
      });
      rtc.onicecandidate =async (event) => {
        if (event.candidate) {
         await socket.emit("icecandidate", {
            me: myId,
            friend: fdId,
            candidate: event.candidate,
          });
        }
      };
      rtc.ontrack = (event) => {
        handleRemoteStream(event.streams[0]);
      };

      return rtc;
    },
    [socket, myId, fdId, handleRemoteStream],
  );

  useEffect(() => {
    if(!socket) return;
    let pc;
  const initStage = async () => {
  try {
    const stm = await generateStream(type); // wait for user to allow
    if (!stm) throw new Error("No media stream available");
    myStream.current = stm;
    setLocalStream(stm);
    pc = await CreatePeearConnection(stm); // add tracks during creation
    pcRef.current = pc;
    console.log("Initialized PC:", pc);
   startCallingAfterAddedMedia(); // start safely
  } catch (err) {
    toast.error("Please allow camera/mic access to start the call");
  }
};

    initStage();

    return () => {
      pc?.close();
      myStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [socket]);
  
  
  console.log("Initialized PC:", pcRef.current);
  function handleRemoteStream(stream) {
    const hasVideo = stream.getVideoTracks().length > 0;
    const hasAudio = stream.getAudioTracks().length > 0;

    if (hasVideo) {
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
      if (remoteAudio.current) remoteAudio.current.srcObject = stream;
      if (remoteVideo.current) remoteVideo.current.style.display = "block";
      if (exchangeRemoteStream.current)
        exchangeRemoteStream.current.srcObject = stream;
    } else {
      if (remoteVideo.current) remoteVideo.current.style.display = "none";
    }

    if (!hasVideo && hasAudio) {
      if (remoteAudio.current) {
        remoteAudio.current.srcObject = stream;
        visualEffect(canvRef.current, stream);
      }
    }
  }

  //////////////////////////////////////globally call both stram and rtc for one time call////////////////////////////////////
  if (
    type === "Video" &&
    callInv === "call-received" &&
    exchangeLocalStream.current !== null &&
    myStream.current !== null
  ) {
    exchangeLocalStream.current.srcObject = myStream.current;
  }
  const isReady = () => {
    return (
      pcRef.current &&
      myStream.current &&
      myStream.current.getTracks().length > 0
    );
  };

  const startCall = async () => {
    console.log(socket)
    setMyFace(true);
    setIsRing(true);
    socket?.emit("signal-call", {
      senderId: store.userInfo.id,
      receiverId: fdId,
      name: store.userInfo.name,
      profile: store.userInfo.profile,
      type,
    });
    setCallInv("call-start");
    setCallAlert("local");
  };

  const startCallFromReceiver = async () => {
    await socket?.emit("receivedCallSuccess", {
      friendId: fdId,
      msg: "call received success",
    });
  };

 const startCallingAfterAddedMedia = async ()=> {
    const backYes = await checkBackCamera();
    setIsBackcameraExist(backYes);
      if (action == "call-start") {
      checkPermissionStatus(toast);
     startCall()
    }
    if (action == "call-received") {
      startCallFromReceiver();
    }
 
 }
  ///////////////////////////Render webRTC in here///////////////////////////////
  useEffect(() => {
    socket &&
      socket.on("receivedCallSuccess", () => {
        setCallInv("call-received");
        setCallAlert("none");
        setTimeout(() => {
          init();
        }, 3000);
      });
    return () => {
      socket && socket.off("receivedCallSuccess");
    };
  }, [socket]);

  ///////////////////////////////////////////////////Here is the receiver env/////////////////////////////////////////
  useEffect(() => {
    socket &&
      socket.on("offer", async (res) => {
        const answer = await createAnswer(
          res.offer,
          pcRef.current,
          iceCandidateQueue.current,
        );
        (await socket) &&
          socket.emit("answer", { me: res.friend, friend: res.me, answer });
      });
    ///////////////////////Receive answer////////////////////////
    socket &&
      socket.on("answer", async (res) => {
        await setRemoteAns(res.answer, pcRef.current);

        // ✅ flush queued ICE
        for (const candidate of iceCandidateQueue.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        iceCandidateQueue.current = [];
      });
    //////////////////////////Receive Ice////////////////////////////////
    socket &&
      socket.on("icecandidate", async (candidate) => {
        const pc = pcRef.current;
        if (!pc) return;
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          iceCandidateQueue.current.push(candidate);
        }
      });

    return () => {
      socket && socket.off("offer");
      socket && socket.off("answer");
      socket && socket.off("icecandidate");
    };
  }, [socket]);

  //////////////////////////////////////////////////////////////////////////////
  const init = async () => {
    await callStartKey(socket, pcRef.current, myId, fdId);
  };

  const handleCallEnd = async () => {
    setMyFace(false);
    setIsRing(false);
    socket && (await socket?.emit("end-call", { id: fdId, end: "call-end" }));
    socket &&
      (await socket.on("call-reached", (res) => {
        console.log(res);
      }));
    setCallInv("end-call");
    setCallAlert("none");
  };
  // useEffect(() => {

  // }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("call-reached", (res) => {
        setCallAlert("remote");
      });
    return () => {};
  }, [socket]);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////Here is the logic for screen sharing method/////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const videoTrack = screenStream.getVideoTracks()[0];
      setScreenTrack(videoTrack);
      if (pcRef.current) {
        const sender = pcRef.current
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }
      setIsScreenSharing(true);
      // When user clicks browser STOP button
      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  //////////////////////////////////////////////////////////////
  const stopScreenShare = () => {
    const cameraTrack = myStream.current?.getVideoTracks()[0];
    if (!cameraTrack) return;
    if (pcRef.current) {
      const sender = pcRef.current
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) {
        sender.replaceTrack(cameraTrack);
      }
    }
    if (screenTrack) {
      screenTrack.stop();
    }
    setScreenTrack(null);
    setIsScreenSharing(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////Here is the logic for toggling between audio and video calling///////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [toggleVid, setToggleVid] = useState(type);
  const toggleVideo = async () => {
    if (!pcRef.current) return;
    const videoTrack = myStream.current?.getVideoTracks()[0];
    const audioTrack = myStream.current?.getAudioTracks()[0];
    if (toggleVid === "Video") {
      // VIDEO → AUDIO
      if (videoTrack) videoTrack.enabled = false;
      if (audioTrack) audioTrack.enabled = !toggleMick;
      setToggleVid("Audio");
    } else {
      // AUDIO → VIDEO
      if (videoTrack) videoTrack.enabled = true;
      if (audioTrack) audioTrack.enabled = !toggleMick; // usually keep audio on
      setToggleVid("Video");
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////Here is the logic for toggling between forth and back camera///////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Toggle Camera Logic (Front <-> Back)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [switchCam, setSwitchCam] = useState(false); // false = front, true = back
  // Helper function to switch camera
  async function switchCamera(getStreamFn, isBackCamera) {
    if (!myStream.current) return;

    const pc = pcRef.current;
    if (!pc) return;

    // Save previous tracks
    const prevAudio = myStream.current.getAudioTracks()[0];
    const prevVideo = myStream.current.getVideoTracks()[0];

    // Stop old tracks (prevents camera freeze / mobile issues)
    myStream.current.getTracks().forEach((track) => track.stop());

    // Get new stream (front or back)
    const newStream = await getStreamFn();
    const newAudio = newStream.getAudioTracks()[0];
    const newVideo = newStream.getVideoTracks()[0];

    // Replace tracks in peer connection safely
    const senders = pc.getSenders();
    const audioSender = senders.find((s) => s.track?.kind === "audio");
    const videoSender = senders.find((s) => s.track?.kind === "video");

    if (audioSender && newAudio) await audioSender.replaceTrack(newAudio);
    if (videoSender && newVideo) await videoSender.replaceTrack(newVideo);

    // Preserve previous mute states
    if (prevAudio && !prevAudio.enabled) newAudio.enabled = false;
    if (prevVideo && !prevVideo.enabled) newVideo.enabled = false;

    // Update local stream reference
    myStream.current = newStream;

    // Update toggle state
    setSwitchCam(isBackCamera);
  }

  // Use these functions in your UI / button handlers
  const setFrontCameraStream = () => switchCamera(frontVideStream, false);
  const setBackCameraStream = () => switchCamera(backVideStream, true);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const toggleMicro = () => {
    if (myStream.current) {
      setToggleMick(!toggleMick);
      const mike = myStream.current?.getAudioTracks()[0];
      mike.enabled = !mike.enabled;
    }
  };
  // const aidioInput = localStream?.getAudioTracks()[0]
  // =========================================================================================================================
  // ===============================================All logic for call stop===================================================
  useEffect(() => {
    socket &&
      socket.on("callStatus", (res) => {
        setCallInv("end-call");
        setCallAlert("none");
        const error = new Audio("/call-ringtone/error-126627.mp3");
        error.play();
      });
    return () => {
      socket && socket.off("callStatus");
    };
  }, [socket]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    socket?.on("end-call-signal", (res) => {
      if (res) {
        if (callInv === "call-received") {
          window.close();
        } else {
          setCallInv("end-call");
          setCallAlert("none");
        }
      }
    });
    return () => {
      socket?.off("end-call-signal");
    };
  }, [socket, callInv]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const onTabClose = () => {
    null;
  };
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", function (event) {
      // Code to execute before the tab is closed
      onTabClose();
    });
  }

  /////////////////////////////////////////////////////////END////////////////////////////////////////////////////////////
  //Start from new
  useEffect(() => {
    if (callInv === "call-received" && type === "Video") {
      setTimeout(() => {
        setFaceVideoMove(false);
      }, 10000);
    }
  }, [callInv]);

  //////////////////////////////Check My browser support screen sharing option///////////////////////////////
  function isDisplayMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }
  return (
    <div
      className={`${
        callInv === "call-start" ? "bg-black duration-1000" : "bg-gray-900"
      } w-screen h-screen overflow-hidden fixed flex justify-center items-center`}
    >
      {callAlert === "local" && action === "call-start" && (
        <audio autoPlay src="/call-ringtone/local-alarm (1).mp3" loop></audio>
      )}
      {callAlert === "remote" && action === "call-start" && (
        <audio autoPlay src="/call-ringtone/remote-alaram.mp3" loop></audio>
      )}

      {(callInv === "call-start" || callInv === "call-received") &&
        toggleVid == "Video" && (
          <div>
            {myFace && type === "Video" && (
              <div
                onClick={() => setToggleStream(!toggleStream)}
                className="absolute cursor-pointer z-50 right-4 top-4 w-3/12 rounded-md h-3/12"
              >
                {localStream && (
                  <div
                    className={`${toggleStream ? "hidden" : "block"} ${
                      faceVideoMove
                        ? "scale-100 duration-150"
                        : "scale-0 duration-150"
                    }`}
                  >
                    <MyVideoStream stream={localStream} />
                  </div>
                )}

                <video
                  className={`scale-x-[-1] rounded-lg max-h-[300px] mx-auto duration-150 w-auto ${
                    toggleStream ? "block" : "hidden"
                  }  ${
                    faceVideoMove
                      ? "scale-100 duration-150"
                      : "scale-0 duration-150"
                  }`}
                  autoPlay
                  ref={exchangeRemoteStream}
                ></video>
              </div>
            )}
          </div>
        )}

      <div>
        {/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}
        {type === "Video" && callInv !== "call-received" && (
          <div>
            <img
              className={`border-white mx-auto duration-500 ${
                callInv === "end-call"
                  ? "w-32 h-32 border-[4px]"
                  : "shadow-[-1px_5px_40px_0px_white] w-48 h-48 border-[2px]"
              } rounded-full`}
              src={profile}
              alt="profile-image"
            />
            {type === "Video" && (
              <h3 className="text-2xl text-white text-center">
                {callInv === "end-call"
                  ? "Video call end"
                  : ` You are in video call with ${name}`}
              </h3>
            )}
          </div>
        )}
        {type === "Audio" && (
          <div>
            <img
              className={`border-[2px] duration-1000 border-white ${
                callInv === "call-received" && "opacity-60"
              } mx-auto w-48 h-48 shadow-[-1px_5px_40px_0px_white] rounded-full`}
              src={profile}
              alt="profile-image"
            />
            {callInv === "call-received" && (
              <h2
                className={`font-semibold w-fit mx-auto py-2 px-4 rounded-lg text-center ${
                  callInv === "call-received" && "text-white"
                } text-3xl uppercase`}
              >
                {name}
              </h2>
            )}
            {type === "Audio" && callInv !== "call-received" && (
              <h3 className="text-2xl text-white">
                {callInv === "end-call"
                  ? "Audio call end"
                  : ` You are in audio call with ${name}`}
              </h3>
            )}
          </div>
        )}

        {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}
        <div className="relative">
          <div
            className={`${
              callInv === "call-start" ? "scale-1 duration-500" : "scale-0"
            } flex absolute top-0 left-[50%] -translate-x-[50%] justify-between px-6 items-center gap-6 py-2 bg-gray-500/10 rounded-full shadow-sm shadow-gray-700`}
          >
            <h4
              className="text-white w-fit bg-red-500 p-2 rounded-full cursor-pointer"
              onClick={handleCallEnd}
            >
              <MdCallEnd size={30} />
            </h4>
            <h2 className="text-white w-fit bg-gray-500/10 p-2 rounded-full cursor-not-allowed">
              <LuScreenShareOff size={30} />
            </h2>
            <h2 className="text-white w-fit bg-gray-500/10 p-2 rounded-full cursor-not-allowed">
              <IoVideocamOffOutline size={30} />
            </h2>
            <button className="text-white w-fit bg-gray-500/10 p-2 rounded-full cursor-not-allowed">
              <CiMicrophoneOff size={30} />
            </button>
          </div>
          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div
            className={`${
              callInv === "end-call" ? "scale-1 duration-500" : "scale-0"
            } flex absolute top-0 left-[50%] -translate-x-[50%] justify-between px-6 items-center mt-3 gap-6 py-2 bg-gray-500/10 rounded-full shadow-sm shadow-gray-700`}
          >
            <h4
              className="text-white w-fit bg-green-500 p-2 rounded-full cursor-pointer"
              onClick={startCall}
            >
              <MdCallEnd size={30} />
            </h4>
            <button
              onClick={() => window.close()}
              className="text-white w-fit bg-red-500 p-2 rounded-full cursor-pointer"
            >
              <RxCross1 size={30} />
            </button>
          </div>
        </div>

        {/* ///////////////////////////////////////////////////////////video call logic here///////////////////////////////////////////////////////////// */}
        {!remoteVideo.current?.srcObject &&
          callInv === "call-received" &&
          type === "Video" && (
            <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden flex justify-center items-center">
              <h2 className="text-2xl text-white">
                <ImSpinner10 size={28} className="animate-spin" />
              </h2>
            </div>
          )}

        {callInv === "call-received" && type === "Video" && (
          <div className="relative">
            <video
              onMouseMove={() => {
                setFaceVideoMove(true);
                setTimeout(() => {
                  setFaceVideoMove(false);
                }, 60000);
              }}
              className={`hidden scale-x-100 rounded-lg h-screen w-auto ${
                toggleStream ? "hidden" : "block"
              }`}
              autoPlay
              muted
              ref={remoteVideo}
            ></video>
            <video
              onMouseMove={() => {
                setFaceVideoMove(true);
                setTimeout(() => {
                  setFaceVideoMove(false);
                }, 60000);
              }}
              className={`scale-x-[-1] rounded-lg h-screen w-auto ${
                toggleStream ? "block" : "hidden"
              }`}
              autoPlay
              muted
              ref={exchangeLocalStream}
            ></video>
          </div>
        )}
        {/* //////////////////////////////////////audio call logic////////////////////////////////////////// */}
        {callInv === "call-received" && type === "Audio" && (
          <div className="w-screen h-screen overflow-hidden -z-10 absolute -top-[5%] left-0">
            <canvas ref={canvRef} className="w-full h-full bg-black"></canvas>
          </div>
        )}

        {callInv === "call-received" &&
          (type === "Audio" || type == "Video") && (
            <div className="flex mx-auto absolute bottom-10 md:bottom-0 left-[50%] -translate-x-[50%] justify-between px-6 items-center gap-6 py-2 bg-gray-500/10 rounded-full border-2 border-white">
              <h4
                className="text-white w-fit bg-red-500 p-2 rounded-full cursor-pointer"
                onClick={handleCallEnd}
              >
                <MdCallEnd size={30} />
              </h4>
              {isDisplayMediaSupported() && (
                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className="text-white w-fit bg-gray-500/10 p-2 rounded-full"
                >
                  {isScreenSharing ? (
                    <LuScreenShareOff size={30} />
                  ) : (
                    <LuScreenShare size={30} />
                  )}
                </button>
              )}
              <button
                onClick={toggleVideo}
                className="text-white w-fit bg-gray-500/10 p-2 rounded-full"
              >
                {toggleVid == "Audio" ? (
                  <IoVideocamOffOutline size={30} />
                ) : (
                  <GoDeviceCameraVideo size={30} />
                )}
              </button>
              {isBackcameraExist && (
                <div>
                  {switchCam ? (
                    <button
                      onClick={setFrontCameraStream}
                      className="text-white w-fit bg-gray-500/10 p-2 rounded-full"
                    >
                      <IoCameraReverseOutline size={30} />
                    </button>
                  ) : (
                    <button
                      onClick={setBackCameraStream}
                      className="text-white w-fit bg-gray-500/10 p-2 rounded-full"
                    >
                      <IoCameraOutline size={30} />
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={toggleMicro}
                className="text-white w-fit bg-gray-500/10 p-2 rounded-full"
              >
                {toggleMick ? (
                  <CiMicrophoneOff size={30} />
                ) : (
                  <CiMicrophoneOn size={30} />
                )}
              </button>
            </div>
          )}
      </div>
      <audio autoPlay ref={remoteAudio} style={{ display: "none" }} />
      <ToastContainer />
    </div>
  );
};

const Suspen = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default Suspen;
/////
