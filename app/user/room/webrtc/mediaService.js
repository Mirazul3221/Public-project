export async function getUserMediaStream(type = "Video") {
  if (type === "Video") {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  }

  return navigator.mediaDevices.getUserMedia({
    audio: true,
  });
}

export async function getScreenShareStream() {
  return navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
}