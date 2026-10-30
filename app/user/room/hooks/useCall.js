import { useEffect, useRef } from "react";
import { getUserMediaStream } from "../webrtc/mediaService";
import { addLocalTrackst, createAnswer, createOffer, createPeerConnection } from "../webrtc/peerService";
export function useCall(socket,myId,fbid,name,profile,type) {
  const pcRef = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  useEffect(() => {
    async function init() {
      localStream.current = await getUserMediaStream(type);
      pcRef.current = createPeerConnection();

  pcRef.current.onicecandidate = (event) => {
    if (!event.candidate) return;
   socket && socket.emit("icecandidate", {
      me: myId,
      friend: fbid,
      candidate: event.candidate
    });
  };
      addLocalTrackst(pcRef.current, localStream.current);
      pcRef.current.ontrack = (event) => {
        remoteStream.current = event.streams[0];
      };

    }

    init();
  }, [socket]);

const startCall = async () => {
  const offer = await createOffer(pcRef.current);

  socket.emit("offer", {
    me: myId,
    friend: fbid,
    offer,
  });
};

  useEffect(() => {
   socket && socket.on("offer", async (res) => {
    alert(res.offer)
      const answer = await createAnswer(pcRef.current, res.offer);
      socket.emit("answer", { me: res.friend, friend: res.me, answer });
    });

  socket &&  socket.on("answer", async ({ answer }) => {
  if (pcRef.current.signalingState !== "have-local-offer") return;

  await pcRef.current.setRemoteDescription(answer);
});

 socket && socket.on("icecandidate", async ({ candidate }) => {
  try {
    if (!pcRef.current) return;
    if (!pcRef.current.remoteDescription) return;

    await pcRef.current.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  } catch (err) {
    console.error("ICE ERROR", err);
  }
});

    return () => {
     socket && socket.off("offer");
     socket && socket.off("answer");
    socket &&  socket.off("icecandidate");
    };
  }, [socket]);

  return {
    startCall,
    localStream,
    remoteStream
  };
}