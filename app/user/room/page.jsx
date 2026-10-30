"use client";
import { useStore } from "@/app/global/DataProvider";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSocket } from "../global/SocketProvider";
import { callAlert } from "./common/app";
import WebRTCClient from "./webrtc/WebRTCClient";
import CallManager from "./webrtc/CallManager";

const Page = () => {
  const { store } = useStore();
  const { socket } = useSocket();
  const data = useSearchParams();
  const myId = data.get("my_peear");
  const friendId = data.get("friend_peear");
  const name = data.get("name");
  const profile = data.get("profile");
  const type = data.get("type");
  const action = data.get("action");
  const [callInv, setCallInv] = useState(action);
  ///////////////////////////////////////////////////////////////////////////////
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const call = new CallManager(socket, myId, friendId, type);

    if (action === "call-start") {
      call.startCaller(localVideo.current, remoteVideo.current);
    }

    if (action === "call-received") {
      call.startReceiver(localVideo.current, remoteVideo.current);
    }
  }, [socket]);


  return (
    <div className="w-screen h-screen bg-black">
      <video ref={remoteVideo} autoPlay />
      <video ref={localVideo} autoPlay muted className="small-video" />
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
