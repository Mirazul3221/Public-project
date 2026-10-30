import { configuration, videoTrack } from "../common/app";
export default class WebRTCClient {
  constructor(socket, myId, friendId) {
    this.socket = socket;
    this.myId = myId;
    this.friendId = friendId;

    this.pc = new RTCPeerConnection(configuration);
    this.localStream = null;
    this.remoteStream = null;

    this.onRemoteStream = null;

    this.setupPeerEvents();
    this.setupSocketEvents();
  }

  async initMedia(type) {
    const constrain = type == "Video" ? videoTrack : {audio: true}
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: type === "Video",
      audio: true
    });

    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream);
    });

    return this.localStream;
  }

  setupPeerEvents() {
    this.pc.ontrack = (event) => {
      this.remoteStream = event.streams[0];

      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    this.pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      this.socket.emit("icecandidate", {
        me: this.myId,
        friend: this.friendId,
        candidate: event.candidate
      });
    };
  }

  setupSocketEvents() {
    this.socket.on("offer", async ({ offer, me }) => {
      if (me !== this.friendId) return;
      await this.handleOffer(offer);
    });

    this.socket.on("answer", async ({ answer }) => {
      await this.pc.setRemoteDescription(answer);
    });

    this.socket.on("icecandidate", async ( candidate ) => {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.socket.emit("offer", {
      me: this.myId,
      friend: this.friendId,
      offer
    });
  }

  async handleOffer(offer) {
    await this.pc.setRemoteDescription(offer);

    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.socket.emit("answer", {
      me: this.myId,
      friend: this.friendId,
      answer
    });
  }

  toggleMic() {
    const track = this.localStream.getAudioTracks()[0];
    if (track) track.enabled = !track.enabled;
  }

  toggleCamera() {
    const track = this.localStream.getVideoTracks()[0];
    if (track) track.enabled = !track.enabled;
  }

  async startScreenShare() {
    const screen = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });

    const screenTrack = screen.getVideoTracks()[0];

    const sender = this.pc.getSenders().find(
      (s) => s.track.kind === "video"
    );

    sender.replaceTrack(screenTrack);

    screenTrack.onended = () => {
      const camTrack = this.localStream.getVideoTracks()[0];
      sender.replaceTrack(camTrack);
    };
  }

  close() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc.close();
  }
}