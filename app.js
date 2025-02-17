const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gravity = 9.81;
let angle = 45;
let speed = 50;
let ball = null;
let explosion = null; // Holds explosion state

const flightTimeDisplay = document.getElementById("flightTime");
const flightDistanceDisplay = document.getElementById("flightDistance");

function calculateFlightData() {
  const radians = angle * (Math.PI / 180);
  const timeOfFlight = (2 * speed * Math.sin(radians)) / gravity;
  const distance = (Math.pow(speed, 2) * Math.sin(2 * radians)) / gravity;
  flightTimeDisplay.textContent = timeOfFlight.toFixed(2);
  flightDistanceDisplay.textContent = distance.toFixed(2);
}

function drawCannon() {
  // Draw cannon base
  ctx.fillStyle = "gray";
  ctx.fillRect(30, canvas.height - 60, 30, 40);

  // Draw cannon barrel
  ctx.save();
  ctx.translate(45, canvas.height - 50);
  ctx.rotate((-angle * Math.PI) / 180);
  ctx.fillStyle = "black";
  ctx.fillRect(0, -8, 50, 16);
  ctx.restore();

  // Draw cannon wheel
  ctx.beginPath();
  ctx.arc(45, canvas.height - 20, 12, 0, Math.PI * 2);
  ctx.fillStyle = "darkgray";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function checkCollision() {
  if (ball && ball.y >= canvas.height - 50 && !ball.exploding) {
    ball.exploding = true;
    // Initialize explosion state
    explosion = {
      x: ball.x,
      y: ball.y,
      size: 30,      // initial explosion radius
      maxSize: 60    // maximum explosion radius
    };
    // After the explosion duration, clear the ball and explosion, and change the avatar
    setTimeout(() => {
      ball = null;
      explosion = null;
      changeAvatar();
    }, 1000);
  }
}

function updateExplosion(deltaTime) {
  if (explosion) {
    // Increase the explosion size gradually until it reaches maxSize
    explosion.size += 20 * deltaTime; // growth rate (pixels per second)
    if (explosion.size > explosion.maxSize) {
      explosion.size = explosion.maxSize;
    }
  }
}

function drawExplosion() {
  if (explosion) {
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.stroke();
  }
}

function changeAvatar() {
    const avatars = [
      "img/jaiberDiaz.png",
      "img/nicolasAngulo.png",
      "img/santiagoMoreno.png",
      "img/sergioMahecha.png",
      "img/valentinaMartinez.png"
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
  
    // Get the avatar elements
    const avatarContainer = document.getElementById("avatarContainer");
    const avatarImage = document.getElementById("avatarImage");
  
    // Set the random avatar and show the container
    avatarImage.src = randomAvatar;
    avatarContainer.style.display = "block";  // reveal the avatar
  }
  


function launchBall() {
  const radians = angle * (Math.PI / 180);
  ball = {
    x: 60,
    y: canvas.height - 50,
    vx: speed * Math.cos(radians),
    vy: -speed * Math.sin(radians),
    time: 0,
    exploding: false
  };
  calculateFlightData();
}

function updateBall(deltaTime) {
  if (!ball) return;
  if (!ball.exploding) {
    ball.time += deltaTime;
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime + 0.5 * gravity * Math.pow(deltaTime, 2);
    ball.vy += gravity * deltaTime;
    checkCollision();
  }
}

function drawBall() {
  if (ball && !ball.exploding) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCannon();
  drawBall();
  drawExplosion();
}

// Use a single animation loop for both updating and drawing
let lastTime = performance.now();
function animate() {
  const now = performance.now();
  const deltaTime = (now - lastTime) / 1000; // in seconds
  lastTime = now;
  
  updateBall(deltaTime);
  updateExplosion(deltaTime);
  draw();
  
  requestAnimationFrame(animate);
}
animate();

// Event listeners
document.getElementById("launchButton").addEventListener("click", launchBall);
document.getElementById("angleInput").addEventListener("input", (e) => {
  angle = parseFloat(e.target.value);
  calculateFlightData();
});
document.getElementById("speedInput").addEventListener("input", (e) => {
  speed = parseFloat(e.target.value);
  calculateFlightData();
});
