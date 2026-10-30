import WebRTCClient from "./WebRTCClient";

export default class CallManager {
  constructor(socket, myId, friendId, type) {
    this.client = new WebRTCClient(socket, myId, friendId);
    this.type = type;
  }

  async startCaller(localVideo, remoteVideo) {
    const stream = await this.client.initMedia(this.type);

    localVideo.srcObject = stream;

    this.client.onRemoteStream = (stream) => {
      remoteVideo.srcObject = stream;
    };

    await this.client.createOffer();
  }

  async startReceiver(localVideo, remoteVideo) {
    const stream = await this.client.initMedia(this.type);

    localVideo.srcObject = stream;
    this.client.onRemoteStream = (stream) => {
      remoteVideo.srcObject = stream;
    };
  }
}