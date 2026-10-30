export const visualEffect = (
  canvas,
  stream,
  imageSrc,
  duration = "00:00"
) => {
  if (!canvas || !stream) return;

  const ctx = canvas.getContext("2d");

  // ================= CANVAS SIZE =================
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();

  // ================= VARIABLES =================
  let analyser;
  let dataArray;
  let bufferLength;
  let audioContext;
  let source;
  let animationId;

  // ================= IMAGE =================
  const img = new Image();
  img.src = imageSrc;

  // ================= INIT =================
  init();

  async function init() {
    try {
      // close previous suspended issue
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

      // resume if browser suspended it
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // create source
      source = audioContext.createMediaStreamSource(stream);

      // analyser
      analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.9;

      bufferLength = analyser.frequencyBinCount;

      dataArray = new Uint8Array(bufferLength);

      // connect
      source.connect(analyser);

      // draw
      draw();
    } catch (err) {
      console.error("visualEffect error:", err);
    }
  }

  // ================= DRAW =================
  function draw() {
    const animate = () => {
      if (!ctx || !analyser) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(dataArray);

      // average audio volume
      const avg =
        dataArray.reduce((a, b) => a + b, 0) /
        bufferLength;

      // reactive radius
      const radius = 180 + avg * 1.2;

      // ================= BACKGROUND GLOW =================
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius
      );

      gradient.addColorStop(
        0,
        "rgba(255,255,255,0.9)"
      );

      gradient.addColorStop(
        0.3,
        "rgba(255,255,255,0.4)"
      );

      gradient.addColorStop(
        0.6,
        "rgba(255,255,255,0.1)"
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // ================= CENTER DARK CIRCLE =================
      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        55,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#000";

      ctx.fill();

      // ================= PROFILE IMAGE =================
      if (img.complete) {
        const size = 120;

        ctx.save();

        ctx.beginPath();

        ctx.arc(
          centerX,
          centerY,
          size / 2,
          0,
          Math.PI * 2
        );

        ctx.closePath();

        ctx.clip();

        ctx.drawImage(
          img,
          centerX - size / 2,
          centerY - size / 2,
          size,
          size
        );

        ctx.restore();
      }

      // ================= GLOW RING =================
      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        65,
        0,
        Math.PI * 2
      );

      ctx.lineWidth = 6;

      ctx.strokeStyle = "#fff";

      ctx.shadowBlur = 30;

      ctx.shadowColor = "#fff";

      ctx.stroke();

      ctx.shadowBlur = 0;

      // ================= DURATION =================
      ctx.font = "18px Arial";

      ctx.fillStyle = "#fff";

      ctx.textAlign = "center";

      ctx.fillText(
        duration,
        centerX,
        centerY + 110
      );

      // next frame
      animationId =
        requestAnimationFrame(animate);
    };

    animate();
  }

  // ================= RESIZE =================
  window.addEventListener(
    "resize",
    resizeCanvas
  );

  // ================= CLEANUP =================
  return () => {
    try {
      // stop animation
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      // remove resize listener
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      // disconnect source
      if (source) {
        source.disconnect();
      }

      // disconnect analyser
      if (analyser) {
        analyser.disconnect();
      }

      // close audio context
      if (
        audioContext &&
        audioContext.state !== "closed"
      ) {
        audioContext.close();
      }
    } catch (err) {
      console.error("cleanup error:", err);
    }
  };
};