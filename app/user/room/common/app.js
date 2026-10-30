    export const configuration = {
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"]
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

      
       export const videoTrack = {
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
      // facingMode: { exact: "user" },
    },
  };

  export  const callAlert = async (socket,callInv,senderId,receiverId,name,profile,type) => {
    if (callInv === "call-start") {
      await socket?.emit("signal-call", {
        senderId,
        receiverId,
        name,
        profile,
        type,
      });
    }
  };
