import React, { useCallback, useEffect, useRef, useState } from 'react'
import { adjustBitrate, backVideStream, checkBackCamera, createOffer, formatTime, frontVideStream, generateStream, pauseCallTimer, resetCallTimer, rtConfig, startCallTimer } from './common/app'
import { useSocket } from '@/app/user/global/SocketProvider';
import MyVideoStream from './MyVideoStream';
import { useStore } from '@/app/global/DataProvider';
import { MdCallEnd } from 'react-icons/md';
import { CiMicrophoneOff, CiMicrophoneOn } from 'react-icons/ci';
import { IoCameraOutline, IoCameraReverseOutline, IoVideocamOffOutline } from 'react-icons/io5';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { LuScreenShare, LuScreenShareOff } from 'react-icons/lu';

const CallingUI = ({ callingData, dispatch }) => {
  const { myId, fdId, name, profile, title, type } = callingData.data;
  const [time,setTime] = useState(null)
  const iceCandidateQueue = useRef([]);
  const myStream = useRef(null);
  const { socket } = useSocket();
  const { store } = useStore();
  const pcRef = useRef(null);
  const [dualStream, setDuelStream] = useState(null);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(type == "Video" ? true : false);
  const [isRemoteVideoExist, setIsRemoteVideoExist] = useState(false);
  const [remoteVideo, setRemoteVideo] = useState(null);
  const [remoteAudio, setRemoteAudio] = useState(null);
  const [toggleMicro, setToggleMicro] = useState(false);
  const [isBackcameraExist, setIsBackcameraExist] = useState(false);
  const [switchCam, setSwitchCam] = useState(false); // false = front, true = back
  const [remoteStream, setRemoteStream] = useState(null);
  const myVideoRef = useRef(null);
  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////webRTC logic start from here/////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const CreatePeearConnection = useCallback(
    async (stm) => {
      const rtc = new RTCPeerConnection(rtConfig);
      stm?.getTracks().forEach((track) => {
        (track);
        rtc.addTrack(track, stm);
      });

      return rtc;
    },
    [socket, myId, fdId],
  );

  useEffect(() => {
    if (!socket) return;
    startCall()
    return () => {
      pcRef.current?.close();
      myStream.current?.getTracks().forEach((track) => track.stop());
    }
  }, [socket, type])
  const startCall = async (pc) => {
    try {
      const backYes = await checkBackCamera();
      setIsBackcameraExist(backYes);
      const stm = await generateStream(); // wait for user to allow
      if (type == "Audio") {
        const videoTrack = stm.getVideoTracks()[0];
        videoTrack.enabled = false; // 👈 start as audio-only
      }
      if (!stm) throw new Error("No media stream available");
      myVideoRef.current = stm
      myStream.current = stm;
      setRemoteVideo(stm)
      pc = await CreatePeearConnection(stm); // add tracks during creation
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await socket.emit("icecandidate", {
            me: myId,
            friend: fdId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const stm = event.streams[0];
        const hasVideo = stm.getVideoTracks().length > 0;
        const hasAudio = stm.getAudioTracks().length > 0;
        const audioTrack = stm.getAudioTracks();
        // stm.getVideoTracks().forEach(track => {
        //   track.onmute = () => {
        //     console.log("Remote video OFF");
        //     setIsRemoteVideoOn(false);
        //   };

        //   track.onunmute = () => {
        //     console.log("Remote video ON");
        //     setIsRemoteVideoOn(true);
        //   };
        // });
        setRemoteStream(stm);

        if (hasVideo) {
          setIsRemoteVideoExist(true)
          setRemoteVideo(stm);
          setRemoteAudio(stm);
        }
        if (!hasVideo && hasAudio) {
          setIsRemoteVideoExist(false)
          setRemoteAudio(stm);
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
      pcRef.current = pc;

      // 4️⃣ Wait for ICE gathering **only if mobile**
      if (isMobileDevice()) {
        await new Promise((resolve) => {
          if (pc.iceGatheringState === "complete") return resolve();

          pc.onicegatheringstatechange = () => {
            if (pc.iceGatheringState === "complete") resolve();
          };
        });
      } else {
        console.log("Desktop detected — skipping ICE wait");
      }

      socket.emit("signal-call", {
        senderId: store.userInfo.id,
        receiverId: fdId,
        name: store.userInfo.name,
        profile: store.userInfo.profile,
        type,
        offer: pc.localDescription, // ✅ send FULL SDP
      });
      await socket?.emit('callStatus', { id: fdId, msg: 'call-start' });
    } catch (err) {
      alert("Please allow camera/mic access to start the call");
    }
  };

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

  useEffect(() => {
    const pc = pcRef.current;
    if (!pc) return;
    const interval = setInterval(() => {
      adjustBitrate(pc);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    ///////////////////////Receive answer////////////////////////
    socket &&
      socket.on("answer", async ({ answer }) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        iceCandidateQueue.current.forEach(async (candidate) => {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
        iceCandidateQueue.current.length = 0;
      });

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
        if (res.msg == "call-cancle") {
          dispatch({ type: "END_CALL" });
          pcRef.current?.close();
          myStream.current?.getTracks().forEach((track) => track.stop());
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
      socket && socket.off("icecandidate");
      socket && socket.off("answer");
      socket && socket.off("callStatus");
    }
  }, [socket])


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
      await socket?.emit('callStatus', { id: fdId, msg: 'switch_audio' });
    } else {
      // AUDIO → VIDEO
      if (videoTrack) videoTrack.enabled = true;
      if (audioTrack) audioTrack.enabled = !toggleMicro; // usually keep audio on
      setToggleVid("Video");
      await socket?.emit('callStatus', { id: fdId, msg: 'switch_video' });
    }
  };

  ///////////////////////////////////Device manipulation system in here////////////////////////////////////
  const toggleMicrophone = () => {
    if (myStream.current) {
      setToggleMicro(!toggleMicro);
      const mike = myStream.current?.getAudioTracks()[0];
      mike.enabled = !mike.enabled;
    }
  };


  const handleCallEnd = async () => {
    dispatch({ type: "END_CALL" });
    pcRef.current?.close();
    myStream.current?.getTracks().forEach((track) => track.stop());
    await socket?.emit('callStatus', { id: fdId, msg: 'call-cancle' })
  }

  //////////////////////////////Check My browser support screen sharing option///////////////////////////////
  function isDisplayMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////Here is the logic for screen sharing method/////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


  if (callingData.isCalling) {
    return (
      <div>
        <div className="fixed top-0 left-0 w-screen bg-black h-screen z-[9999]">
          {
            type == 'Video' && remoteAudio && <div className="md:w-60 w-20 h-auto absolute top-0 right-0 md:top-10 md:right-10">
              <MyVideoStream name={name} profile={profile} remoteAudio={null} stream={myStream.current} isRemoteVideoOn={isRemoteVideoOn} pluck={false} />
            </div>
          }

          <div className="w-full h-full fixed top-0 left-0 -z-10">
            <div className="md:p-5 flex justify-center items-center w-[100dvw] h-[100dvh]"> <div className="h-full min-w-10/12 max-w-full"> <MyVideoStream name={name} profile={profile} remoteAudio={remoteAudio} stream={remoteAudio ? remoteStream : myStream.current} isRemoteVideoOn={isRemoteVideoOn} time={time} /></div></div>
          </div>

          <div className="flex justify-center items-center gap-2 w-fit mx-auto absolute left-[50%] -translate-x-[50%] bottom-[8%]">
            <h4
              className="text-white w-fit bg-red-500/70 hover:bg-red-600 p-2 rounded-full cursor-pointer"
              onClick={handleCallEnd}
            >
              <MdCallEnd size={20} />
            </h4>

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
            {/* --------------------------------toggling video--------------------------------- */}
            <button
              onClick={toggleVideo}
              className={`${toggleVid == 'Audio' ? "bg-white" : "bg-black text-white"} border border-white w-fit p-2 rounded-full`}
            >
              {toggleVid == "Audio" ? (
                <IoVideocamOffOutline size={20} />
              ) : (
                <GoDeviceCameraVideo size={20} />
              )}
            </button>


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

            {/* -----------------------------------Microphone--------------------------------- */}
            <button
              onClick={toggleMicrophone}
              className={`${toggleMicro ? "bg-white" : "bg-black text-white"} w-fit p-2 rounded-full border border-white`}
            >
              {toggleMicro ? (
                <CiMicrophoneOff size={20} />
              ) : (
                <CiMicrophoneOn size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

}

export default CallingUI