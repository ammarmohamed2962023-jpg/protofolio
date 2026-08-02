'use client';
import { useEffect, useRef } from 'react';

/**
 * ParticlesBg — Canvas-based animated network topology background.
 * Simulates an interactive TCP/IP node mesh with mouse spotlight.
 */
export default function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let mouse = { x: -9999, y: -9999 };

    /* ── Resize handler ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Mouse tracking ── */
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── Node factory ── */
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 70);
    const nodes = Array.from({ length: count }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 1.5 + 1,
      // Randomly assign protocol label
      label: Math.random() > 0.7
        ? ['TCP', 'IP', 'DNS', 'HTTP', 'SSH', 'UDP'][Math.floor(Math.random() * 6)]
        : null,
    }));

    /* ── Draw frame ── */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const baseColor    = isDark ? '0,229,255'   : '2,132,199';
      const nodeColor    = isDark ? '59,130,246'  : '37,99,235';
      const labelColor   = isDark ? '#00e5ff'     : '#0284c7';

      /* Spotlight glow around cursor */
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
      grd.addColorStop(0, `rgba(${baseColor}, 0.07)`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* Update positions */
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      /* Draw edges */
      const maxDist   = 140;
      const mouseDist = 180;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        /* Mouse connections */
        const mx   = nodes[i].x - mouse.x;
        const my   = nodes[i].y - mouse.y;
        const md   = Math.sqrt(mx * mx + my * my);
        if (md < mouseDist) {
          const alpha = (1 - md / mouseDist) * 0.5;
          ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      /* Draw nodes */
      nodes.forEach(n => {
        const mx   = n.x - mouse.x;
        const my   = n.y - mouse.y;
        const dist = Math.sqrt(mx * mx + my * my);
        const isHovered = dist < 100;
        const radius = isHovered ? n.r * 2.5 : n.r;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? `rgba(${baseColor}, 0.95)`
          : `rgba(${nodeColor}, 0.55)`;
        ctx.fill();

        /* Glow for hovered node */
        if (isHovered) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(${baseColor}, 0.8)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        /* Protocol labels */
        if (n.label && isHovered) {
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillStyle = labelColor;
          ctx.fillText(n.label, n.x + 6, n.y - 6);
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
