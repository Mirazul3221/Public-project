import { useEffect, useRef } from "react";

export default function CallUI({ localStream, remoteStream, startCall }) {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    if (localVideo.current && localStream.current) {
      localVideo.current.srcObject = localStream.current;
    }

    if (remoteVideo.current && remoteStream.current) {
      remoteVideo.current.srcObject = remoteStream.current;
    }
  });

  return (
    <div>

      <video ref={localVideo} autoPlay muted />

      <video ref={remoteVideo} autoPlay />

      <button onClick={startCall}>
        Start Call
      </button>

    </div>
  );
}