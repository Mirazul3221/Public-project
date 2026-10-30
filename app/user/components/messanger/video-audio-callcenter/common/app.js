// export const rtConfig = {
//   iceServers: [
//     {
//       urls: ["stun:stun.l.google.com:19302"],
//     },
//     {
//       urls: "stun:stun.relay.metered.ca:80",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:80",
//       username: "8bcf7a1d9f479409cd2da804",
//       credential: "+54hRwPBtCqhR25s",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:80?transport=tcp",
//       username: "8bcf7a1d9f479409cd2da804",
//       credential: "+54hRwPBtCqhR25s",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:443",
//       username: "8bcf7a1d9f479409cd2da804",
//       credential: "+54hRwPBtCqhR25s",
//     },
//     {
//       urls: "turns:global.relay.metered.ca:443?transport=tcp",
//       username: "8bcf7a1d9f479409cd2da804",
//       credential: "+54hRwPBtCqhR25s",
//     },
//   ],
// };

export const rtConfig = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    { urls: ["stun:bn-turn1.xirsys.com"] },
    {
      username:
        "u6n-PrwG4CFv-5mcQ-zmck8qMTaOFu9WbjBVQ9x3zTepTOp_ODSWG6X9xfRkSsiiAAAAAGdl3wd0b3JpcTMyMjE=",
      credential: "e3c6e8e0-bf17-11ef-8ded-0242ac140004",
      urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

//////////////////////////////////////////////////////////////////////////////
////////////////////////global media stream call here////////////////////////
////////////////////////////////////////////////////////////////////////////
export const generateStream = async (type) => {
  // 📶 detect network (optional)
  const connection = navigator.connection;
  const isFastNetwork = connection?.effectiveType === "4g";

  const videoTrack = {
audio: {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
  sampleRate: 48000,
  sampleSize: 16,
},
    video: {
      // 🔥 adaptive resolution
      width: { ideal: isFastNetwork ? 1280 : 640 },
      height: { ideal: isFastNetwork ? 720 : 360 },

      // 🔥 smooth video
      frameRate: { ideal: isFastNetwork ? 30 : 15 },

      // optional (front camera)
      facingMode: "user",
    },
  };

  const audioTracks = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };

  try {
        const stream = await navigator.mediaDevices.getUserMedia(videoTrack)
    return stream;
  } catch (error) {
    console.error("Error getting media stream:", error);
  }
};

export const frontVideStream = async () => {
  const stm = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: {
        ideal: 380,
        min: 380,
        max: 1920,
      },
      height: {
        ideal: 200,
        min: 200,
        max: 1280,
      },
      frameRate: { ideal: 10 },
      facingMode: { exact: "user" },
    },
  });

  return stm;
};

export const backVideStream = async () => {
  const stm = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: {
        ideal: 380,
        min: 380,
        max: 1920,
      },
      height: {
        ideal: 200,
        min: 200,
        max: 1280,
      },
      frameRate: { ideal: 10 },
      facingMode: { exact: "environment" },
    },
  });

  return stm;
};

export async function checkBackCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.some(
    (device) =>
      device.kind === "videoinput" &&
      device.label.toLowerCase().includes("back"),
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export async function checkPermissionStatus(toast) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  if (window.innerWidth > 768) {
    devices?.forEach((info, index) => {
      setTimeout(() => {
        toast(info.kind + info.label);
      }, index * 100);
    });
  }
}

////////////////////////////////////////////////////////////////////
const checkMediaPermission = async (type) => {
  try {
    const result = await navigator.permissions.query({
      name: type === "Video" ? "camera" : "microphone",
    });

    return result.state; // "granted" | "prompt" | "denied"
  } catch {
    return "prompt";
  }
};

export const prepareMediaAndStart = async (type, call) => {
  const permission = await checkMediaPermission(type);
  // ✅ CASE 1: Already granted
  if (permission === "granted") {
    call();
  }

  // ⚠️ CASE 2: First time (prompt)
  if (permission === "prompt") {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: type === "Video",
      //   audio: true,
      // });

      // stream.getTracks().forEach((t) => t.stop()); // just permission
      // call();
    } catch (err) {
      console.log("Permission denied");
      return;
    }
  }

  // ❌ CASE 3: Denied
  if (permission === "denied") {
    alert("Enable camera/microphone from browser settings");
    return;
  }
};

//////////////////////////////////////send offer to the remote user///////////////////////////////////
export const callStartKey = async (socket, pc, myId, fdId) => {
  if (!pc) return;
  // if (pc.signalingState !== "stable") return;
  const offer = await createOffer(pc);
  (await socket) && socket.emit("offer", { me: myId, friend: fdId, offer });
};

///////////////////////////Create a offer///////////////////////////
export const createOffer = async (pc) => {
  if (pc) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }
};

//////////////////////////////////////////Create answer///////////////////////////////////////////////
export const createAnswer = async (offer, pc, iCdQ) => {
  if (pc) {
    await pc.setRemoteDescription(offer);
    // add queued candidates
    iCdQ.forEach(async (candidate) => {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
    iCdQ.length = 0;
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }
};

/////////////////////////////////////receive offer and send answer for the remote user//////////////////////////////////////////
export const setRemoteAns = async (ans, pc) => {
  if (!pc) return;
  // if (pc.signalingState !== "have-local-offer") {
  //   console.warn("Skipping answer because state is:", pc.signalingState);
  //   return;
  // }
  await pc.setRemoteDescription(new RTCSessionDescription(ans));
};

///////////////////////////////////////////////////////////////////////////////////////

 export const adjustBitrate = async (pc) => {
  const sender = pc.getSenders().find(s => s.track?.kind === "video");
  if (!sender) return;

  const stats = await pc.getStats();

  stats.forEach(async (report) => {
    if (report.type === "outbound-rtp" && report.kind === "video") {
      const bitrate = report.bytesSent;

      const params = sender.getParameters();
      if (!params.encodings) params.encodings = [{}];

      // 🔥 simple logic (you can improve)
      if (report.framesPerSecond < 15) {
        params.encodings[0].maxBitrate = 200000; // low
      } else {
        params.encodings[0].maxBitrate = 1500000; // high
      }

      await sender.setParameters(params);
    }
  });
};

let callStartTime = null;
let accumulatedTime = 0;
let timerInterval = null;

export function startCallTimer(onTick) {
  // 🔥 always reset first
  clearInterval(timerInterval);

  callStartTime = Date.now();

  timerInterval = setInterval(() => {
    const total = accumulatedTime + (Date.now() - callStartTime);
    onTick?.(formatTime(total));
  }, 1000);
}

export function pauseCallTimer() {
   clearInterval(timerInterval);

  clearInterval(timerInterval);
  timerInterval = null;

  accumulatedTime += Date.now() - callStartTime;
  return accumulatedTime;
}

export function resetCallTimer(time = 0) {
  pauseCallTimer();
  accumulatedTime = time;
  callStartTime = null;
}

export function formatTime(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / (1000 * 60)) % 60;
  const h = Math.floor(ms / (1000 * 60 * 60));

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}