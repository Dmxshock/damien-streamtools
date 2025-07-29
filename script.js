let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");
let angle = 0;
let spinning = false;

function drawWheel() {
  let { labels, colors } = wheelConfig;
  let sliceAngle = (2 * Math.PI) / labels.length;

  for (let i = 0; i < labels.length; i++) {
    ctx.beginPath();
    ctx.moveTo(400, 400);
    ctx.arc(400, 400, 400, i * sliceAngle, (i + 1) * sliceAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(400, 400);
    ctx.rotate(i * sliceAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.fillText(labels[i], 380, 0);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  let spinTime = wheelConfig.spinDuration;
  let start = performance.now();
  let finalAngle = angle + Math.random() * 360 + 720;

  let spinSound = new Audio(wheelConfig.sounds.spin);
  spinSound.play();

  function animate(now) {
    let elapsed = now - start;
    if (elapsed < spinTime) {
      angle += 10;
      angle %= 360;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(400, 400);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.translate(-400, -400);
      drawWheel();
      ctx.restore();
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      let selected = Math.floor(((360 - (angle % 360)) / 360) * wheelConfig.labels.length);
      document.getElementById("resultPanel").textContent = `Result: ${wheelConfig.labels[selected]}`;
      new Audio(wheelConfig.sounds.win).play();
    }
  }

  requestAnimationFrame(animate);
}

drawWheel();
