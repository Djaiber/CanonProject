const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 9.81;
let angle = 45;
let speed = 50;
let ball = null;

const flightTimeDisplay = document.getElementById("flightTime");
const flightDistanceDisplay = document.getElementById("flightDistance");

function calculateFlightData() {
    const radians = angle * (Math.PI / 180);
    const timeOfFlight = (2 * speed * Math.sin(radians)) / gravity;
    const distance = (Math.pow(speed, 2) * Math.sin(2 * radians)) / gravity;
    
    flightTimeDisplay.textContent = timeOfFlight.toFixed(2);
    flightDistanceDisplay.textContent = distance.toFixed(2);
}

// Function to draw the cannon
function drawCannon() {
    ctx.fillStyle = "gray";
    ctx.fillRect(30, canvas.height - 60, 30, 40);
    
    // Cannon Barrel
    ctx.save();
    ctx.translate(45, canvas.height - 50);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, -8, 50, 16);
    ctx.restore();
    
    // Cannon Wheel
    ctx.beginPath();
    ctx.arc(45, canvas.height - 20, 12, 0, Math.PI * 2);
    ctx.fillStyle = "darkgray";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
}


function launchBall() {
    const radians = angle * (Math.PI / 180);
    ball = {
        x: 60,
        y: canvas.height - 50,
        vx: speed * Math.cos(radians),
        vy: -speed * Math.sin(radians),
        time: 0
    };
    calculateFlightData();
}

function updateBall(deltaTime) {
    if (!ball) return;

    ball.time += deltaTime;
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime + 0.5 * gravity * Math.pow(deltaTime, 2);
    ball.vy += gravity * deltaTime;

    if (ball.y >= canvas.height - 50) {
        ball = null;
    }
}

function drawBall() {
    if (!ball) return;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCannon();
    drawBall();
    requestAnimationFrame(draw);
}

document.getElementById("launchButton").addEventListener("click", launchBall);
document.getElementById("angleInput").addEventListener("input", (e) => {
    angle = parseFloat(e.target.value);
    calculateFlightData();
});
document.getElementById("speedInput").addEventListener("input", (e) => {
    speed = parseFloat(e.target.value);
    calculateFlightData();
});

setInterval(() => updateBall(0.016), 16);
draw();
