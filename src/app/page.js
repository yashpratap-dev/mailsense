'use client';
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from 'next/dynamic';
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

const BookScrollScene = dynamic(() => import('@/components/BookScrollScene'), { ssr: false });

/* ── Scroll Reveal ── */
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Stat Card ── */
function StatCard({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div style={{
      borderRadius: '16px',
      border: '1px solid rgba(167,139,250,0.12)',
      padding: '28px 20px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.035)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 40px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.55, type: 'spring', bounce: 0.35 }}
        style={{
          fontSize: '2.6rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '8px',
        }}
      >
        {value}
      </motion.div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: 500, letterSpacing: '0.02em' }}>
        {label}
      </p>
    </div>
  );
}

/* ── Thin glow divider ── */
function GlowDivider() {
  return (
    <div style={{
      width: '100%', height: '1px',
      background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.18), rgba(96,165,250,0.18), transparent)',
    }} />
  );
}

export default function Home() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#f8fafc' }}>

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* ══ Hero — Three.js cinematic scene ══ */}
      <BookScrollScene />

      {/* ══ CONTENT BELOW HERO ══ */}
      <div style={{ background: '#050508', position: 'relative' }}>

        {/* Ambient glow bleeding from hero */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: '500px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }} />

        {/* ── Stats ── */}
        <section style={{ padding: '80px 24px 60px', position: 'relative' }}>
          <ScrollReveal>
            <div style={{
              maxWidth: '860px', margin: '0 auto',
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px',
            }} className="md:grid-cols-4">
              {[
                ['2M+',  'Emails Processed'],
                ['98%',  'Cold Emails Blocked'],
                ['4 hrs','Saved / Week'],
                ['10K+', 'Active Users'],
              ].map(([v, l]) => (
                <StatCard key={l} value={v} label={l} />
              ))}
            </div>
          </ScrollReveal>
        </section>

        <GlowDivider />

        {/* ── Marquee ── */}
        <section style={{ padding: '48px 0' }}>
          <MarqueeDemoHorizontal />
        </section>

        <GlowDivider />

        {/* ── Problem ── */}
        <ScrollReveal delay={0.05}><Problem /></ScrollReveal>

        <GlowDivider />

        {/* ── Features ── */}
        <section style={{ padding: '80px 24px' }}>
          <ScrollReveal><Features /></ScrollReveal>
          <ScrollReveal delay={0.08}><Features2 /></ScrollReveal>
          <ScrollReveal delay={0.08}><Features3 /></ScrollReveal>
          <ScrollReveal delay={0.08}><Features4 /></ScrollReveal>
        </section>

        <GlowDivider />

        {/* ── Testimonials ── */}
        <section style={{ padding: '96px 24px' }}>
          <ScrollReveal>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <p style={{
                  fontSize: '11px', letterSpacing: '3.5px', textTransform: 'uppercase',
                  color: 'rgba(167,139,250,0.6)', fontFamily: 'var(--font-geist-mono, monospace)',
                  marginBottom: '16px', fontWeight: 500,
                }}>
                  MailSense Love
                </p>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                  letterSpacing: '-0.03em', color: '#f8fafc', lineHeight: 1.1,
                }}>
                  Clean Inbox,{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Happy Life
                  </span>
                </h2>
              </div>
              <TestimonialsGrid />
            </div>
          </ScrollReveal>
        </section>

        <GlowDivider />

        {/* ── Pricing ── */}
        <ScrollReveal><Pricing /></ScrollReveal>

        <GlowDivider />

        {/* ── CTA ── */}
        <section style={{ padding: '120px 24px' }}>
          <ScrollReveal>
            <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                borderRadius: '24px',
                border: '1px solid rgba(167,139,250,0.15)',
                padding: 'clamp(48px, 8vw, 80px) clamp(24px, 6vw, 64px)',
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 0 80px rgba(124,58,237,0.12), 0 0 200px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.07)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 65%)',
                }} />
                <p style={{
                  fontSize: '11px', letterSpacing: '3.5px', textTransform: 'uppercase',
                  color: 'rgba(167,139,250,0.6)', fontFamily: 'var(--font-geist-mono, monospace)',
                  marginBottom: '20px', fontWeight: 500, position: 'relative',
                }}>
                  Get Started Today
                </p>
                <h2 style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
                  letterSpacing: '-0.035em', lineHeight: 1.08,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #a78bfa 50%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', marginBottom: '20px', position: 'relative',
                }}>
                  Take back your inbox.
                </h2>
                <p style={{
                  fontSize: '1.05rem', color: 'rgba(255,255,255,0.38)',
                  maxWidth: '420px', margin: '0 auto 40px', lineHeight: 1.65, position: 'relative',
                }}>
                  Join 10,000+ professionals who let AI handle the noise.
                </p>
                <a
                  href="/api/auth/login"
                  style={{
                    display: 'inline-block', padding: '14px 36px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                    color: '#fff', fontWeight: 700, fontSize: '15px',
                    borderRadius: '12px', textDecoration: 'none',
                    letterSpacing: '-0.01em', position: 'relative',
                    boxShadow: '0 0 48px rgba(124,58,237,0.4), 0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 72px rgba(124,58,237,0.6), 0 8px 32px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 48px rgba(124,58,237,0.4), 0 4px 20px rgba(0,0,0,0.4)';
                  }}
                >
                  Start Free — No Credit Card
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <Footer />
      </div>
    </div>
  );
}
