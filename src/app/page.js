'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import * as THREE from "three";
import Navbar from "../app/components/header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import Features2 from "@/components/features2";
import Features3 from "@/components/Features3";
import Features4 from "@/components/Features4";
import Pricing from "@/components/Pricing";
import Problem from "@/components/Problems";
import { MarqueeDemoHorizontal } from "@/components/marquee";
import TestimonialsGrid from "@/components/TestimonialsGrid";

/* ─────────────── THREE.JS PARTICLE BACKGROUND ─────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    // Particles
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tealColor = new THREE.Color('#14b8a6');
    const indigoColor = new THREE.Color('#6366f1');
    const whiteColor = new THREE.Color('#e2e8f0');

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const mix = Math.random();
      const c = mix < 0.33 ? tealColor : mix < 0.66 ? indigoColor : whiteColor;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', handleMouse);

    // Scroll parallax
    let scrollY = 0;
    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', handleScroll);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      frame += 0.001;

      particles.rotation.y = frame * 0.12 + mouseX;
      particles.rotation.x = frame * 0.06 - mouseY;
      camera.position.y = -scrollY * 0.001;

      renderer.render(scene, camera);
      return id;
    };
    const animId = animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─────────────── 3D TILT CARD ─────────────── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

/* ─────────────── FLOATING INBOX MOCKUP ─────────────── */
const mockEmails = [
  { from: "John Smith", subject: "Re: Q3 Proposal — looks great!", tag: "Priority", color: "text-emerald-400", dot: "bg-emerald-400" },
  { from: "no-reply@promo.biz", subject: "You've been selected! Claim now 🎁", tag: "Cold", color: "text-red-400", dot: "bg-red-400" },
  { from: "GitHub", subject: "PR #42 merged into main", tag: "Dev", color: "text-indigo-400", dot: "bg-indigo-400" },
  { from: "Newsletter Co.", subject: "Your weekly digest is ready", tag: "Newsletter", color: "text-yellow-400", dot: "bg-yellow-400" },
];

function InboxMockup() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % mockEmails.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10"
      style={{
        background: 'rgba(15,15,25,0.75)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 0 60px rgba(99,102,241,0.25), 0 0 120px rgba(20,184,166,0.1)',
        transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-white/40 font-mono tracking-widest">MAILSENSE</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">● AI Active</span>
      </div>

      {/* Email rows */}
      <ul className="divide-y divide-white/5">
        {mockEmails.map((email, i) => (
          <motion.li
            key={i}
            animate={{ backgroundColor: active === i ? 'rgba(99,102,241,0.08)' : 'transparent' }}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.dot} ${active === i ? 'shadow-lg' : 'opacity-40'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80 truncate">{email.from}</span>
                <span className={`text-xs font-semibold ${email.color} ml-2 flex-shrink-0`}>{email.tag}</span>
              </div>
              <p className="text-xs text-white/30 truncate mt-0.5">{email.subject}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* AI bar */}
      <div className="px-4 py-3 border-t border-white/10 flex gap-2 flex-wrap">
        {['✦ Summarize', '⊘ Block Cold', '↩ Smart Reply', '⬡ Auto-Label'].map(a => (
          <span key={a} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50 hover:text-teal-400 hover:border-teal-500/40 transition-colors cursor-pointer">
            {a}
          </span>
        ))}
      </div>

      {/* Glow reflection */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)' }} />
    </div>
  );
}

/* ─────────────── SCROLL SECTION WRAPPER ─────────────── */
function ScrollReveal({ children, delay = 0, y = 60 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, rotateX: 15, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800 }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── STAT COUNTER ─────────────── */
function StatCounter({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <TiltCard className="rounded-2xl border border-white/10 p-6 text-center"
      style={{ background: 'rgba(15,15,25,0.6)', backdropFilter: 'blur(16px)' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="text-4xl font-black bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent"
      >
        {value}
      </motion.div>
      <p className="mt-1 text-sm text-white/40">{label}</p>
    </TiltCard>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const springY  = useSpring(heroY, { stiffness: 80, damping: 20 });

  return (
    <div className="relative min-h-screen bg-[#05050f] text-white overflow-x-hidden">

      {/* THREE.JS BACKGROUND */}
      <ParticleCanvas />

      {/* Dark overlay gradient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(20,184,166,0.12) 0%, transparent 60%)'
      }} />

      {/* CONTENT */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative min-h-screen flex items-center px-4 pt-10 pb-24 overflow-hidden">

          {/* Big blur glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <motion.div
            style={{ y: springY, opacity: heroOpacity, scale: heroScale }}
            className="mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-medium mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Now in Public Beta
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
              >
                <span className="bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  Your inbox,
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  finally smart.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed"
              >
                MailSense uses AI to automatically sort, summarize, and act on your emails —
                so you spend time on what matters, not on mail.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a href="/api/auth/login"
                  className="group relative px-8 py-3.5 font-semibold rounded-xl text-white overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #4f46e5)' }} />
                </a>
                <a href="https://github.com/yashpratap-dev/mailsense"
                  target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3.5 font-semibold rounded-xl border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Star on GitHub
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex gap-6 flex-wrap"
              >
                {[['🔐','Privacy-first'],['🌍','Open Source'],['⚡','GPT-4 Powered']].map(([icon, label]) => (
                  <span key={label} className="flex items-center gap-1.5 text-sm text-white/35">
                    {icon} {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — 3D Inbox */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <InboxMockup />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/25 tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="relative px-4 py-20">
          <ScrollReveal>
            <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['2M+','Emails Processed'],['98%','Cold Emails Blocked'],['4 hrs','Saved Per Week'],['10K+','Active Users']].map(([v,l]) => (
                <StatCounter key={l} value={v} label={l} />
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── MARQUEE ── */}
        <section className="py-10 px-4 border-y border-white/5">
          <MarqueeDemoHorizontal />
        </section>

        {/* ── PROBLEM ── */}
        <ScrollReveal delay={0.1}>
          <Problem />
        </ScrollReveal>

        {/* ── FEATURES ── */}
        <section className="py-24 px-4">
          <ScrollReveal><Features /></ScrollReveal>
          <ScrollReveal delay={0.1}><Features2 /></ScrollReveal>
          <ScrollReveal delay={0.1}><Features3 /></ScrollReveal>
          <ScrollReveal delay={0.1}><Features4 /></ScrollReveal>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="relative py-24 px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-7xl">
              <h2 className="text-center mb-16">
                <span className="block text-sm font-mono text-teal-400 tracking-widest uppercase mb-3">MailSense Love</span>
                <span className="block text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
                  Clean Inbox, Happy Life
                </span>
              </h2>
              <TestimonialsGrid />
            </div>
          </ScrollReveal>
        </section>

        {/* ── PRICING ── */}
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>

        {/* ── CTA BANNER ── */}
        <section className="px-4 py-32">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <TiltCard className="rounded-3xl p-12 border border-white/10 relative overflow-hidden"
                style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(24px)' }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                    Take back your inbox.
                  </h2>
                  <p className="text-white/40 mb-10 text-lg">
                    Join 10,000+ professionals who let AI handle the noise.
                  </p>
                  <a href="/api/auth/login"
                    className="inline-block px-10 py-4 font-bold rounded-2xl text-white text-lg shadow-2xl transition-all hover:scale-105 hover:shadow-teal-500/30"
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}
                  >
                    Start Free — No Credit Card
                  </a>
                </div>
              </TiltCard>
            </div>
          </ScrollReveal>
        </section>

        <Footer />
      </div>
    </div>
  );
}
