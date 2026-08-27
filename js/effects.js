// AI Note: Added canvas-based particle system for celebration. Hooks into the win detection logic.
let particles = [];
let confettiAnimationId = null;
// Celebration effect - simple confetti particle system
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // Create particles with random properties
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#00FFEA", "#FF00C8", "#39FF14", "#FFE600", "#BF5FFF"];
  // Generate 500 confetti particles with random positions, sizes, colors, and speeds.
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
    });
  }
  // Animation loop - updates particle positions and redraws them until they fall off the screen.
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < canvas.height) active = true;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (active) {
      confettiAnimationId = requestAnimationFrame(render);
    }
  }
  render();
}
// Stop confetti animation and clear particles - called when restarting the game to ensure no lingering effects.
function stopConfetti() {
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  particles = [];
}
