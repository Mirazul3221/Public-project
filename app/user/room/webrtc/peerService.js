import { configuration } from "../common/app";

export function createPeerConnection() {
  const pc = new RTCPeerConnection(configuration);
  return pc;
}

export function addLocalTrackst(pc, stream) {
  stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
  });
}

export async function createOffer(pc) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(pc, offer) {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  return answer;
}