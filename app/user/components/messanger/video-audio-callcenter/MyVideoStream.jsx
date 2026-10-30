import { useEffect, useRef } from "react";
import { visualEffect } from "./AudioEffect";

const MyVideoStream = ({
  stream,
  remoteAudio,
  name,
  profile,
  isRemoteVideoOn,
  pluck = true,
  time = null,
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // ================= AUDIO =================
  useEffect(() => {
    if (!audioRef.current || !remoteAudio) return;

    audioRef.current.srcObject = remoteAudio;

    audioRef.current
      .play()
      .catch((err) =>
        console.log("Audio play error:", err)
      );
  }, [remoteAudio]);

  // ================= VIDEO =================
  useEffect(() => {
    if (
      !videoRef.current ||
      !stream ||
      !isRemoteVideoOn
    )
      return;

    videoRef.current.srcObject = stream;

    videoRef.current
      .play()
      .catch((err) =>
        console.log("Video play error:", err)
      );
  }, [stream, isRemoteVideoOn]);

  // ================= AUDIO EFFECT =================
  useEffect(() => {
    if (
      !canvasRef.current ||
      !remoteAudio ||
      isRemoteVideoOn ||
      !time
    ) {
      return;
    }

    const cleanup = visualEffect(
      canvasRef.current,
      remoteAudio,
      profile,
      time
    );

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [
    remoteAudio,
    isRemoteVideoOn,
    time,
    profile,
    remoteAudio
      ?.getAudioTracks?.()?.[0]?.id,
  ]);

  return (
    <div className="w-full h-full relative bg-black rounded-lg md:rounded-2xl overflow-hidden">
      {/* ================= VIDEO ================= */}
      {isRemoteVideoOn ? (
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          className="w-full h-full object-contain md:object-cover"
        />
      ) : (
        <>
          {pluck && (
            <div className="w-screen h-screen flex items-center justify-center text-white text-xl relative">
              {/* ================= CANVAS ================= */}
              {time &&
                remoteAudio &&
                !isRemoteVideoOn && (
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                )}

              {/* ================= PROFILE CONTENT ================= */}
              {
                !remoteAudio && <div className="relative z-10 flex flex-col items-center">
                  <img
                    className="w-28 h-28 rounded-full object-cover"
                    src={profile}
                    alt={name}
                  />

                  <h2 className="text-center mt-3">
                    {name}
                  </h2>

                  {time && (
                    <h2 className="text-center text-sm">
                      {time}
                    </h2>
                  )}
                </div>
              }
            </div>
          )}
        </>
      )}

      {/* ================= REMOTE AUDIO ================= */}
      {remoteAudio && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
        />
      )}
    </div>
  );
};

export default MyVideoStream;