'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
}

export default function WebGLHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1f3a');
      gradient.addColorStop(1, '#0f1629');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add animated gradient overlay
      const radialGradient = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        0,
        mousePos.x,
        mousePos.y,
        500
      );
      radialGradient.addColorStop(0, 'rgba(58, 90, 64, 0.15)');
      radialGradient.addColorStop(1, 'rgba(58, 90, 64, 0)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Bounce in z
        if (particle.z < 0 || particle.z > 100) {
          particle.vz *= -1;
        }

        // Distance to mouse
        const dx = particle.x - mousePos.x;
        const dy = particle.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse attraction/repulsion
        if (distance < 200) {
          const angle = Math.atan2(dy, dx);
          const force = (200 - distance) / 200;
          particle.vx -= Math.cos(angle) * force * 0.3;
          particle.vy -= Math.sin(angle) * force * 0.3;
        }

        // Scale based on z-depth
        const scale = particle.z / 100;
        const scaledSize = particle.size * scale;
        const scaledOpacity = particle.opacity * scale;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          scaledSize * 3
        );
        gradient.addColorStop(0, `rgba(58, 90, 64, ${scaledOpacity})`);
        gradient.addColorStop(1, 'rgba(58, 90, 64, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - scaledSize * 3,
          particle.y - scaledSize * 3,
          scaledSize * 6,
          scaledSize * 6
        );

        // Draw particle core
        ctx.fillStyle = `rgba(227, 227, 220, ${scaledOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, scaledSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(58, 90, 64, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.globalAlpha = 0.1 * (1 - distance / 150);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <div ref={containerRef} className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-[#0a0e27]">
      {/* WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-6 md:px-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
          }}
          className="max-w-3xl"
        >
          {/* Glow orb decoration */}
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 -right-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#3a5a40]/20 to-transparent blur-3xl"
          />

          {/* Main Headline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white">
              We Design &
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a372] via-[#d4956f] to-[#c4866c] animate-gradient">
                Build Digital
              </span>
            </h1>
          </motion.div>

          {/* Subheading with character reveal effect */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="text-lg md:text-2xl text-white/80 font-light mb-12 leading-relaxed max-w-2xl"
          >
            Award-winning digital experiences that transform businesses into industry leaders
          </motion.p>

          {/* CTA Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.4 },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(58, 90, 64, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#3a5a40] to-[#2a4a30] text-white font-bold text-lg rounded-lg uppercase tracking-wider hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative">Start Your Transformation</span>
              <motion.svg
                className="w-5 h-5 relative"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg uppercase tracking-wider hover:bg-white/10 transition-all duration-300"
            >
              View Our Work
            </motion.button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.8, delay: 0.6 },
              },
            }}
            className="mt-16 pt-8 border-t border-white/10 flex gap-12 md:gap-20"
          >
            {[
              { number: '50+', label: 'Brands Transformed' },
              { number: '98%', label: 'Client Satisfaction' },
              { number: '3x', label: 'Avg. Conversion Boost' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
              >
                <div className="text-3xl md:text-4xl font-black text-white">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-white/60 uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="text-white/40 text-xs uppercase tracking-widest">Scroll to explore</div>
        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
}
