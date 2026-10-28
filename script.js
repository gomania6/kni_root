// KNI UPP - Futuristic Cyber Starfield & Particle Constellation Engine
function initStarfield(canvasId = 'cyberCanvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  });

  const mouse = { x: null, y: null, targetX: 0, targetY: 0, offsetX: 0, offsetY: 0 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.targetX = (e.clientX - width / 2) * 0.04;
    mouse.targetY = (e.clientY - height / 2) * 0.04;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  let stars = [];
  let shootingStars = [];

  function createStars() {
    stars = [];
    const count = Math.min(180, Math.floor((width * height) / 8000));
    for (let i = 0; i < count; i++) {
      const z = Math.random(); // depth layer
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: z > 0.8 ? Math.random() * 1.5 + 1.2 : Math.random() * 1.0 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        z: z, // 0 = far, 1 = near
        color: Math.random() > 0.35 ? '#00f0ff' : (Math.random() > 0.5 ? '#8b5cf6' : '#ffffff'),
        vx: (Math.random() - 0.5) * 0.15 * (z + 0.2),
        vy: (Math.random() - 0.5) * 0.15 * (z + 0.2)
      });
    }
  }

  function spawnShootingStar() {
    if (Math.random() < 0.012 && shootingStars.length < 2) {
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * height * 0.4;
      const length = Math.random() * 120 + 80;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 10 + 12;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: length,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.018,
        color: Math.random() > 0.4 ? '#00f0ff' : '#a78bfa'
      });
    }
  }

  createStars();

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    // Smooth camera drift
    mouse.offsetX += (mouse.targetX - mouse.offsetX) * 0.05;
    mouse.offsetY += (mouse.targetY - mouse.offsetY) * 0.05;

    // 1. Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.twinklePhase += s.twinkleSpeed;
      const twinkle = Math.sin(s.twinklePhase) * 0.4 + 0.6; // alpha 0.2 -> 1.0

      const drawX = s.x + mouse.offsetX * s.z;
      const drawY = s.y + mouse.offsetY * s.z;

      ctx.beginPath();
      ctx.arc(drawX, drawY, s.baseRadius * (0.8 + twinkle * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = twinkle * (s.z * 0.6 + 0.4);

      if (s.z > 0.75) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
      }

      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      // Constellation lines to mouse if close
      if (mouse.x !== null && s.z > 0.5) {
        const dxM = drawX - mouse.x;
        const dyM = drawY - mouse.y;
        const distM = Math.hypot(dxM, dyM);
        if (distM < 130) {
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * (1 - distM / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Constellation lines between nearby stars
      if (s.z > 0.6) {
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          if (s2.z > 0.6) {
            const dx = (s.x - s2.x);
            const dy = (s.y - s2.y);
            const dist = Math.hypot(dx, dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(s2.x + mouse.offsetX * s2.z, s2.y + mouse.offsetY * s2.z);
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 85)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }
    }

    // 2. Shooting Stars
    spawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life -= ss.decay;

      if (ss.life <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - (ss.dx / Math.hypot(ss.dx, ss.dy)) * ss.length;
      const tailY = ss.y - (ss.dy / Math.hypot(ss.dx, ss.dy)) * ss.length;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, ss.color);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = ss.life;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ss.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    }

    requestAnimationFrame(animateStars);
  }

  animateStars();
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Starfield
  initStarfield('cyberCanvas');

  // UTC / Local Telemetry Clock
  function updateClock() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} CEST`;
    const clockEl = document.getElementById('currentTime');
    if (clockEl) clockEl.textContent = timeStr;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Mobile Menu Toggle with Smooth Height/Opacity Transition & Icon Swap
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const closeIcon = document.getElementById('closeIcon');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = !mobileNav.classList.contains('max-h-0');
      if (isOpen) {
        mobileNav.classList.add('max-h-0', 'opacity-0');
        mobileNav.classList.remove('max-h-96', 'opacity-100');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      } else {
        mobileNav.classList.remove('max-h-0', 'opacity-0');
        mobileNav.classList.add('max-h-96', 'opacity-100');
        if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('max-h-0', 'opacity-0');
        mobileNav.classList.remove('max-h-96', 'opacity-100');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      });
    });
  }
});
