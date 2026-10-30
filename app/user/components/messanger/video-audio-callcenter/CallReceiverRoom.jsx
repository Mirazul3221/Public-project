import storeContext from '@/app/global/createContex';
import { useSocket } from '@/app/user/global/SocketProvider';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { HiOutlinePhoneMissedCall } from "react-icons/hi";
import { IoCameraOutline, IoCameraReverseOutline, IoVideocamOffOutline } from "react-icons/io5";
import { GoDeviceCameraVideo } from "react-icons/go";
import { LuPhoneCall, LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import '../../../components/cssfiles/waterdrop.css'
import { adjustBitrate, checkBackCamera, formatTime, generateStream, pauseCallTimer, resetCallTimer, rtConfig, startCallTimer } from './common/app';
import MyVideoStream from './MyVideoStream';
import { MdCallEnd } from 'react-icons/md';
import { CiMicrophoneOff, CiMicrophoneOn } from 'react-icons/ci';
const CallReceiverRoom = ({ data, setData, randomRingtone }) => {
  const { senderId, receiverId, name, profile, type, offer } = data;
  const { socket } = useSocket();
  const pcRef = useRef(null);
  const myStream = useRef(null);
  const iceCandidateQueue = useRef([]);
  const { store, dispatch } = useContext(storeContext)
  const [isCallEnd, setIsCallEnd] = useState(false);
  const [localStream, setLocalStream] = useState(null);
   const [time,setTime] = useState(null)
   const [isRemoteVideoExist, setIsRemoteVideoExist] = useState(false);
  const [isBackcameraExist, setIsBackcameraExist] = useState(false);
  const [toggleMicro, setToggleMicro] = useState(false);
  const [switchCam, setSwitchCam] = useState(false); // false = front, true = back
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(type == "Video" ? true : false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteAudio, setRemoteAudio] = useState(null);
  const CreatePeearConnection = useCallback(
    async (stm) => {
      const rtc = new RTCPeerConnection(rtConfig);
      stm?.getTracks().forEach((track) => {
        rtc.addTrack(track, stm);
      });
      rtc.ontrack = (event) => {
        const remoteStm = event.streams[0];
        // remoteStm.getVideoTracks().forEach(track => {
        //   track.onmute = () => {
        //     console.log("Remote video OFF");
        //     setIsRemoteVideoOn(false);
        //   };

        //   track.onunmute = () => {
        //     console.log("Remote video ON");
        //     setIsRemoteVideoOn(true);
        //   };
        // });
        setRemoteStream(remoteStm);
        setRemoteAudio(remoteStm)
      };

      return rtc;
    },
    [socket, receiverId, senderId],
  );

  const receiveCall = async () => {
    try {
      const stm = await generateStream(); // wait for user to allow
      if (type == "Audio") {
        const videoTrack = stm.getVideoTracks()[0];
        videoTrack.enabled = false; // 👈 start as audio-only
      }
      if (!stm) throw new Error("No media stream available");
      myStream.current = stm;
      // setLocalStream(stm);
      const backYes = await checkBackCamera();
      setIsBackcameraExist(backYes);
      const pc = await CreatePeearConnection(stm); // add tracks during creation
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      iceCandidateQueue.current.forEach(async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });
      iceCandidateQueue.current.length = 0;

      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(answer);
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await socket.emit("icecandidate", {
            me: receiverId,
            friend: senderId,
            candidate: event.candidate,
          });
        }
      };

       pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
      
        if (state === "connected") {
          startCallTimer(setTime); // 🔥 simplest form
        }
      
        if (state === "disconnected") {
          pauseCallTimer();
        }
      
        if (state === "failed" || state === "closed") {
          const last = pauseCallTimer();
          resetCallTimer();
      
          if (last) {
            alert(formatTime(last));
          }
        }
      };
      socket && socket.emit("answer", { me: receiverId, friend: senderId, answer: pc.localDescription });
      pcRef.current = pc;

    } catch (error) {

    }
  }

  useEffect(() => {
    socket && socket?.on('end-call-signal', (res) => {
      if (res) {
        setWindow(false)
      }
    })
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

    socket &&
      socket.on("callStatus", (res) => {
        if (res.msg == 'call-start') {
          setIsCallEnd(false)
        }

        if (res.msg == 'call-cancle') {
          if (remoteStream) {
            cancleCall()
          }
          setIsCallEnd(true)
          const error = new Audio("/call-ringtone/error-126627.mp3");
          error.play();
        }

        if (res.msg == 'switch_audio') {
          setIsRemoteVideoOn(false);
        }

        if (res.msg == 'switch_video') {
          setIsRemoteVideoOn(true);
        }

      });
    return () => {
      socket && socket?.off("end-call-signal");
      socket && socket.off("icecandidate");
      socket && socket.off("callStatus");
    };
  }, [socket, remoteStream]);

  useEffect(() => {
    const pc = pcRef.current;
    if (!pc) return;

    const interval = setInterval(() => {
      adjustBitrate(pc);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pc = pcRef.current;
    const connection = navigator.connection;

    if (!connection || !pc) return;

    const handleChange = async () => {
      console.log("Network changed:", connection.effectiveType);

      const sender = pc.getSenders().find(s => s.track?.kind === "video");
      if (!sender) return;

      const params = sender.getParameters();
      if (!params.encodings) params.encodings = [{}];

      if (connection.effectiveType === "4g") {
        params.encodings[0].maxBitrate = 1500000;
      } else {
        params.encodings[0].maxBitrate = 300000;
      }

      try {
        await sender.setParameters(params);
      } catch (err) {
        console.error("Bitrate update failed:", err);
      }
    };

    connection.addEventListener("change", handleChange);

    handleChange();

    return () => {
      connection.removeEventListener("change", handleChange);
    };
  }, []); // ✅ empty dependency

  const handleReceiveCall = async () => {
    const answer = await createAnswer(data?.offer)
    await socket?.emit('callStatus', { id: data?.senderId, msg: 'call-received', answer })
  }

  const reStartCall = () => {
    const user = { myId: receiverId, fdId: senderId, name, profile, title: null, type, size: 26, color: 'white' }
    dispatch({ type: "START_CALL", payload: user });
    setData(null)
  }

  const cancleCall = async () => {
    pcRef.current?.close();
    myStream.current?.getTracks().forEach((track) => track.stop());
    setData(null)
    await socket?.emit('callStatus', { id: data?.senderId, msg: 'call-cancle' })
  }

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
      if (audioTrack) audioTrack.enabled = !toggleMicro;
      setToggleVid("Audio");
      await socket?.emit('callStatus', { id: data?.senderId, msg: 'switch_audio' });
    } else {
      // AUDIO → VIDEO
      if (videoTrack) videoTrack.enabled = true;
      if (audioTrack) audioTrack.enabled = !toggleMicro; // usually keep audio on
      setToggleVid("Video");
      await socket?.emit('callStatus', { id: data?.senderId, msg: 'switch_video' });
    }
  };

  //////////////////////////////////switch microphone///////////////////////////////////
  const toggleMicrophone = () => {
    if (myStream.current) {
      setToggleMicro(!toggleMicro);
      const mike = myStream.current?.getAudioTracks()[0];
      mike.enabled = !mike.enabled;
    }
  };


  ///////////////////////////////////////Device front and back camera switching/////////////////////////////////
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////Here is the logic for screen sharing method/////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////Check My browser support screen sharing option///////////////////////////////
  function isDisplayMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const videoTrack = screenStream.getVideoTracks()[0];
      setScreenTrack(videoTrack);
      const sender = pcRef.current
        .getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(videoTrack); // 🔥 smoother
      }
      setIsScreenSharing(true);
      if (type == "Audio") await socket?.emit('callStatus', { id: fdId, msg: 'switch_video' });
      // When user clicks browser STOP button
      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };


  //////////////////////////////////////////////////////////////
  const stopScreenShare = async () => {
    const videoTrack = myStream.current?.getVideoTracks()[0];
    const audioTrack = myStream.current?.getAudioTracks()[0];
    if (!audioTrack || !videoTrack) return;
    if (pcRef.current) {
      const sender = pcRef.current
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) {
        sender?.replaceTrack(videoTrack)
      }
    }
    if (screenTrack) {
      screenTrack.stop();
    }
    setScreenTrack(null);
    setIsScreenSharing(false);
    if (type == "Audio") await socket?.emit('callStatus', { id: fdId, msg: 'switch_audio' });
  };


  return (
    <div>
      {
        remoteStream ? <div className='w-screen h-screen bg-black fixed flex justify-center items-center left-0 top-0 z-[9999]'>
                    {
                      type == 'Video' && remoteAudio && <div className="md:w-60 w-20 h-auto absolute top-0 right-0 md:top-10 md:right-10">
                        <MyVideoStream name={name} profile={profile} remoteAudio={null} stream={myStream.current} isRemoteVideoOn={isRemoteVideoOn} pluck={false} />
                      </div>
                    }
          {remoteStream && (
            <div className="md:p-5 flex justify-center items-center w-[100dvw] h-[100dvh]"> <div className="h-full min-w-10/12 max-w-full"><MyVideoStream name={name} profile={profile} remoteAudio={remoteAudio} stream={remoteStream} isRemoteVideoOn={isRemoteVideoOn} time={time} /></div></div>
          )}
          <div className="flex justify-center items-center gap-2 w-fit mx-auto absolute left-[50%] -translate-x-[50%] bottom-[8%]">
            <h4
              className="text-white w-fit bg-red-500/70 hover:bg-red-600 p-2 rounded-full cursor-pointer"
              onClick={cancleCall}
            >
              <MdCallEnd size={20} />
            </h4>
            {/* -------------------------------Front and back camera---------------------------------- */}
            {isBackcameraExist && (
              <div>
                {switchCam ? (
                  <button
                    onClick={setFrontCameraStream}
                    className="bg-white w-fit p-2 rounded-full border border-white"
                  >
                    <IoCameraReverseOutline size={20} />
                  </button>
                ) : (
                  <button
                    onClick={setBackCameraStream}
                    className="w-fit text-white bg-black p-2 rounded-full border border-white"
                  >
                    <IoCameraOutline size={20} />
                  </button>
                )}
              </div>
            )}
            {/* ------------------------------on/of video---------------------------------- */}
            <button
              onClick={toggleVideo}
              className={`${toggleVid == 'Audio' ? "bg-white" : "bg-black text-white"} border border-white w-fit p-2 rounded-full`}
            >
              {toggleVid == "Audio" ? (
                <IoVideocamOffOutline className='text-black' size={20} />
              ) : (
                <GoDeviceCameraVideo size={20} />
              )}
            </button>
            {/* --------------------------------toggling screen--------------------------------- */}
            {isDisplayMediaSupported() && (
              <button
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                className={`${isScreenSharing ? "bg-white" : "bg-black text-white"} w-fit p-2 rounded-full border border-white`}
              >
                {isScreenSharing ? (
                  <LuScreenShareOff size={20} />
                ) : (
                  <LuScreenShare size={20} />
                )}
              </button>
            )}
            {/* -----------------------------------Microphone--------------------------------- */}
            <button
              onClick={toggleMicrophone}
              className={`${toggleMicro ? "bg-white" : "bg-black text-white"} w-fit p-2 rounded-full border border-white`}
            >
              {toggleMicro ? (
                <CiMicrophoneOff className='text-black' size={20} />
              ) : (
                <CiMicrophoneOn size={20} />
              )}
            </button>

          </div>
        </div> : <div>
          {
            !isCallEnd ? <div className='w-screen h-screen bg-gray-300/60 text-white fixed flex justify-center items-center left-0 top-0 z-[9999]'>
              <div className="md:w-3/12 md:h-2/3 w-full h-full rounded-2xl shadow-md bg-gray-50/90 md:bg-white justify-center flex items-center">
                <div className="relative">
                  <h2 className='mb-4 text-lg text-center text-gray-700'>Incoming Call</h2>
                  <img
                    className="border-[3px] border-white mx-auto w-32 h-32 shadow-[-1px_5px_40px_0px_gray] rounded-full"
                    src={data?.profile}
                    alt="profile-image"
                  />
                  {data?.type === "Video" && (
                    <h3 className="text-md md:text-2xl text-gray-500 text-center">
                      {data?.name} is calling you
                    </h3>
                  )}
                  {data?.type === "Audio" && (
                    <h3 className="text:md md:text-2xl text-gray-500 text-center">
                      {data?.name} is calling you
                    </h3>
                  )}
                  <div className="flex justify-center items-center gap-14 mt-3 md:mt-6">
                    <h4 onClick={() => {
                      cancleCall()
                    }} className="text-white w-fit bg-red-500 p-2 rounded-full border-2 cursor-pointer" >
                      {
                        data?.type === 'Audio' ? <HiOutlinePhoneMissedCall size={30} /> : data?.type === 'Video' ? <IoVideocamOffOutline size={30} /> : ''
                      }
                    </h4>
                    <h4 onClick={receiveCall} className="text-white duration-500 w-fit bg-green-500 p-2 rounded-full border-2 cursor-pointer drop" >
                      {data?.type === "Audio" ? <LuPhoneCall size={30} /> : data?.type === "Video" ? <GoDeviceCameraVideo size={30} /> : ''}
                    </h4>
                  </div>
                </div>
              </div>
              <audio autoPlay loop src={`/call-ringtone/${randomRingtone}`}></audio>
            </div> :
              <div className='w-screen h-screen bg-gray-300/60 text-white fixed flex justify-center items-center left-0 top-0 z-40'>
                <div className="md:w-3/12 md:h-2/3 w-full h-full rounded-2xl shadow-md bg-gray-50/90 md:bg-white justify-center flex items-center">
                  <div className="relative">
                    <h2 className='mb-4 text-lg text-center text-gray-700'>Incoming call end</h2>
                    <img
                      className="border-[3px] border-white mx-auto w-32 h-32 shadow-[-1px_5px_40px_0px_gray] rounded-full"
                      src={data?.profile}
                      alt="profile-image"
                    />
                    <h2 className='text-gray-700 text-center mt-4 font-bold text-lg'>{data?.name}</h2>
                    <div className="flex justify-center items-center gap-14 mt-3 md:mt-6">
                      <h4 onClick={() => {
                        cancleCall()
                      }} className="text-white w-fit bg-red-500 p-2 rounded-full border-2 cursor-pointer" >
                        {
                          data?.type === 'Audio' ? <HiOutlinePhoneMissedCall size={30} /> : data?.type === 'Video' ? <IoVideocamOffOutline size={30} /> : ''
                        }
                      </h4>
                      <h4 onClick={() => {
                        reStartCall();
                      }} className="text-white w-fit bg-green-500 p-2 rounded-full border-2 cursor-pointer" >
                        {data?.type === "Audio" ? <LuPhoneCall size={30} /> : data?.type === "Video" ? <GoDeviceCameraVideo size={30} /> : ''}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
          }
        </div>
      }

    </div>
  )
}

export default CallReceiverRoom
