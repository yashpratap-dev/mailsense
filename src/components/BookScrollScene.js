'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BookScrollScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let renderer, animId;

    const run = async () => {
      const THREE = await import('three');

      const W = window.innerWidth;
      const H = window.innerHeight;

      /* ── Renderer ── */
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      /* ── Scene ── */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#050508');
      scene.fog = new THREE.FogExp2('#050508', 0.024);

      /* ── Camera ── */
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.set(0, 0, 6.5);

      /* ─────────────────────────────────────────
         MAIN OBJECT — Torus Knot
      ───────────────────────────────────────── */
      const knotGeo = new THREE.TorusKnotGeometry(1, 0.28, 280, 44, 2, 3);

      const knotMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#5b21b6'),
        emissive: new THREE.Color('#2e1065'),
        emissiveIntensity: 0.55,
        metalness: 0.95,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 1.0,
      });
      const knot = new THREE.Mesh(knotGeo, knotMat);
      scene.add(knot);

      /* Wireframe shell — faint, adds tech depth */
      const wireMat = new THREE.MeshBasicMaterial({
        color: '#c4b5fd',
        wireframe: true,
        transparent: true,
        opacity: 0.055,
      });
      const wireKnot = new THREE.Mesh(knotGeo, wireMat);
      scene.add(wireKnot);

      /* ── Glow shell ── */
      const glowGeo = new THREE.SphereGeometry(1.55, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: '#7c3aed',
        transparent: true,
        opacity: 0.035,
        side: THREE.BackSide,
      });
      scene.add(new THREE.Mesh(glowGeo, glowMat));

      /* ── Halo ring ── */
      const ringGeo = new THREE.TorusGeometry(1.9, 0.005, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#a78bfa',
        transparent: true,
        opacity: 0.32,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.6;
      scene.add(ring);

      const ring2 = ring.clone();
      ring2.rotation.x = Math.PI / 1.4;
      ring2.rotation.y = Math.PI / 3;
      scene.add(ring2);

      /* ─────────────────────────────────────────
         PARTICLES — spherical shell distribution
      ───────────────────────────────────────── */
      const pCount = 3200;
      const pPos    = new Float32Array(pCount * 3);
      const pColors = new Float32Array(pCount * 3);
      const colorA  = new THREE.Color('#a78bfa');
      const colorB  = new THREE.Color('#60a5fa');

      for (let i = 0; i < pCount; i++) {
        const r     = 3.5 + Math.random() * 9;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pPos[i * 3 + 2] = r * Math.cos(phi);

        const mix = (pPos[i * 3 + 1] + r) / (r * 2);
        const c   = colorA.clone().lerp(colorB, mix);
        pColors[i * 3]     = c.r;
        pColors[i * 3 + 1] = c.g;
        pColors[i * 3 + 2] = c.b;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));
      const pMat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.016,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight('#6d28d9', 0.3));

      const pLight1 = new THREE.PointLight('#7c3aed', 10, 16);
      pLight1.position.set(3, 4, 3);
      scene.add(pLight1);

      const pLight2 = new THREE.PointLight('#3b82f6', 6, 14);
      pLight2.position.set(-4, -3, 2);
      scene.add(pLight2);

      const pLight3 = new THREE.PointLight('#e879f9', 4, 10);
      pLight3.position.set(1, -5, -2);
      scene.add(pLight3);

      const pLight4 = new THREE.PointLight('#ffffff', 2.5, 9);
      pLight4.position.set(0, 7, 5);
      scene.add(pLight4);

      /* ── Mouse state ── */
      let mx = 0, my = 0;
      let smoothMX = 0, smoothMY = 0;
      let baseRotX = 0, baseRotY = 0;
      let t = 0;

      const onMove = (e) => {
        mx =  (e.clientX / window.innerWidth  - 0.5) * 2;
        my = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMove);

      const onResize = () => {
        const W2 = window.innerWidth;
        const H2 = window.innerHeight;
        renderer.setSize(W2, H2);
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      /* ── Animation loop ── */
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.005;

        smoothMX += (mx - smoothMX) * 0.038;
        smoothMY += (my - smoothMY) * 0.038;

        baseRotX += 0.0028;
        baseRotY += 0.0045;

        knot.rotation.x     = baseRotX + smoothMY * 0.28;
        knot.rotation.y     = baseRotY + smoothMX * 0.28;
        wireKnot.rotation.x = knot.rotation.x;
        wireKnot.rotation.y = knot.rotation.y;

        ring.rotation.z  =  t * 0.08;
        ring2.rotation.z = -t * 0.05;

        particles.rotation.y = t * 0.035;
        particles.rotation.x = t * 0.012;

        pLight1.intensity = 10 + Math.sin(t * 1.6)       * 2.0;
        pLight2.intensity =  6 + Math.cos(t * 1.2)       * 1.2;
        pLight3.intensity =  4 + Math.sin(t * 2.1 + 1.3) * 0.9;

        camera.position.x += (smoothMX * 0.5  - camera.position.x) * 0.028;
        camera.position.y += (smoothMY * 0.35 - camera.position.y) * 0.028;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    let cleanupFn;
    run().then((fn) => { cleanupFn = fn; });
    return () => { cleanupFn?.(); };
  }, []);

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 28, filter: 'blur(6px)' },
    animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
      />

      {/* Spotlight overlays */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 55% at 75% 18%, rgba(124,58,237,0.22) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 22% 82%, rgba(59,130,246,0.17) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent, #050508)',
      }} />

      {/* Text overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
        userSelect: 'none',
      }}>
        <motion.p {...fadeUp(0.15)} style={{
          fontSize: '11px', letterSpacing: '3.5px',
          textTransform: 'uppercase', color: 'rgba(167,139,250,0.65)',
          fontFamily: 'var(--font-geist-mono, monospace)', marginBottom: '28px', fontWeight: 500,
        }}>
          AI-Powered Inbox Intelligence
        </motion.p>

        <motion.h1 {...fadeUp(0.32)} style={{
          fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)',
          fontWeight: 800, lineHeight: 1.07,
          letterSpacing: '-0.035em', color: '#f8fafc',
          marginBottom: '22px', maxWidth: '880px',
        }}>
          Your inbox,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 60%, #e879f9 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            finally intelligent.
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.5)} style={{
          fontSize: '1.08rem', color: 'rgba(255,255,255,0.42)',
          maxWidth: '460px', lineHeight: 1.68,
          marginBottom: '44px', fontWeight: 400,
        }}>
          MailSense uses AI to automatically sort, summarize, and act on your emails —
          so you focus on what matters, not the noise.
        </motion.p>

        <motion.div {...fadeUp(0.65)} style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <a
            href="/api/auth/login"
            style={{
              padding: '13px 30px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              color: '#fff', fontWeight: 600, fontSize: '14.5px',
              borderRadius: '10px', textDecoration: 'none', letterSpacing: '-0.01em',
              boxShadow: '0 0 36px rgba(124,58,237,0.38), 0 2px 12px rgba(0,0,0,0.4)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease', display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.55), 0 4px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 36px rgba(124,58,237,0.38), 0 2px 12px rgba(0,0,0,0.4)';
            }}
          >
            Get Started Free
          </a>

          <a
            href="https://github.com/yashpratap-dev/mailsense"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '13px 30px',
              background: 'rgba(255,255,255,0.055)', color: 'rgba(255,255,255,0.72)',
              fontWeight: 600, fontSize: '14.5px', borderRadius: '10px',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)', letterSpacing: '-0.01em',
              transition: 'background 0.18s ease, color 0.18s ease, transform 0.18s ease',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.055)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Star on GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          color: 'rgba(255,255,255,0.25)', fontSize: '10px',
          letterSpacing: '2.5px', textTransform: 'uppercase',
          fontFamily: 'var(--font-geist-mono, monospace)', pointerEvents: 'none',
        }}
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1.5px', height: '36px',
            background: 'linear-gradient(to bottom, rgba(167,139,250,0.7), transparent)',
            borderRadius: '2px',
          }}
        />
      </motion.div>
    </section>
  );
}
