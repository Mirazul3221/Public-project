// ✅ SET WebRTC globally
export const setWebRTC = ({ pc, stream,offer }) => {
  if (typeof window !== "undefined") {
    window.__WEBRTC__ = {
      pc,
      stream,
      offer
    };
  }
};

// ✅ GET WebRTC
export const getWebRTC = () => {
  if (typeof window !== "undefined") {
    return window.__WEBRTC__ || null;
  }
  return null;
};

// ✅ CLEAR WebRTC
export const clearWebRTC = () => {
  if (typeof window !== "undefined") {
    const rtc = window.__WEBRTC__;

    if (rtc && rtc.pc) {
      rtc.pc.close();

      // 🔥 stop tracks (important)
      rtc.stream?.getTracks().forEach(track => track.stop());
    }

    window.__WEBRTC__ = null;
  }
};