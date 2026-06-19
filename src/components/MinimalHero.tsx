'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MinimalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create subtle animated gradient orbs
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Clear with solid color
      ctx.fillStyle = '#F6F6F2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(246, 246, 242, 1)');
      gradient.addColorStop(0.5, 'rgba(250, 250, 248, 0.95)');
      gradient.addColorStop(1, 'rgba(246, 246, 242, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle accent glow following mouse
      const radialGradient = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        0,
        mousePos.x,
        mousePos.y,
        400
      );
      radialGradient.addColorStop(0, 'rgba(58, 90, 64, 0.04)');
      radialGradient.addColorStop(1, 'rgba(58, 90, 64, 0)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle animated accent lines
      const time = Date.now() * 0.0001;

      // Top right accent
      ctx.strokeStyle = 'rgba(58, 90, 64, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.7, canvas.height * 0.1 + Math.sin(time) * 20);
      ctx.lineTo(canvas.width * 0.95, canvas.height * 0.2 + Math.cos(time) * 20);
      ctx.stroke();

      // Bottom left accent
      ctx.strokeStyle = 'rgba(58, 90, 64, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.8 + Math.cos(time * 1.3) * 15);
      ctx.lineTo(canvas.width * 0.25, canvas.height - Math.sin(time * 1.3) * 15);
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#F6F6F2] overflow-hidden flex flex-col justify-center">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 md:mb-20"
        >

          {/* Main Headline */}
          <div className="max-w-4xl mb-8 md:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-[#1A1A1A]"
            >
              We Design &
              <br />
              <span className="text-[#d4956f] font-black">Build Digital</span>
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-[#5F5F5F] font-light max-w-2xl mb-10 md:mb-12 leading-relaxed"
          >
            Transforming businesses into industry leaders through digital experiences that convert and engage.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-[#3a5a40] hover:bg-[#2a4a30] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 flex items-center gap-3"
            >
              Start Your Project
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40 text-[#1A1A1A] font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300"
            >
              View Our Work
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-16 pt-12 md:pt-16 border-t border-[#1A1A1A]/10"
        >
          {[
            { number: '50+', label: 'Brands Transformed' },
            { number: '98%', label: 'Client Satisfaction' },
            { number: '3x', label: 'Avg. Conversion Boost' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + idx * 0.1 }}
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1A1A] mb-2">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm font-light text-[#5F5F5F]/70 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <div className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest mb-3">Scroll</div>
        <svg className="w-5 h-5 text-[#1A1A1A]/30 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>

    </div>
  );
}
