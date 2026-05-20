'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkStyle = {
    fontSize: '13.5px', fontWeight: 500, letterSpacing: '0.01em',
    color: 'rgba(255,255,255,0.52)', textDecoration: 'none',
    transition: 'color 0.18s ease',
  };

  return (
    <header style={{
      background: scrolled ? 'rgba(5,5,8,0.88)' : 'rgba(5,5,8,0.45)',
      borderBottom: scrolled
        ? '1px solid rgba(167,139,250,0.1)'
        : '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      transition: 'background 0.35s ease, border-color 0.35s ease',
    }}>
      <nav style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
        height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(124,58,237,0.45)',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span style={{
            fontSize: '17px', fontWeight: 700, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            MailSense
          </span>
        </Link>

        {/* ── Center nav links ── */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '32px' }}>
          {[['/', 'Home'], ['#features', 'Features'], ['#pricing', 'Pricing']].map(([href, label]) => (
            <Link key={label} href={href} style={navLinkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.92)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/yashpratap-dev/mailsense"
            target="_blank" rel="noopener noreferrer"
            style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.92)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Open Source
          </a>
        </div>

        {/* ── Right side ── */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', transition: 'background 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                <Image src={user.picture} alt={user.name} width={26} height={26}
                  className="rounded-full" priority />
                <span style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.8)',
                  maxWidth: '100px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.name}
                </span>
              </button>

              {isMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '180px', background: 'rgba(10,8,18,0.96)',
                  borderRadius: '12px', border: '1px solid rgba(167,139,250,0.14)',
                  backdropFilter: 'blur(24px)', overflow: 'hidden', zIndex: 50,
                  boxShadow: '0 20px 56px rgba(0,0,0,0.6)',
                }}>
                  {[
                    ['/dashboard', 'Dashboard'],
                    ['/settings',  'Settings'],
                  ].map(([href, label]) => (
                    <Link key={label} href={href} style={{
                      display: 'block', padding: '11px 16px', fontSize: '13px',
                      color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                    >
                      {label}
                    </Link>
                  ))}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <Link href="/api/auth/logout" style={{
                    display: 'block', padding: '11px 16px', fontSize: '13px',
                    color: 'rgba(248,113,113,0.85)', textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/api/auth/login" style={{ ...navLinkStyle, padding: '7px 14px' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
              >
                Login
              </Link>
              <Link href="/api/auth/login" style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: '#fff', fontWeight: 600, fontSize: '13.5px',
                borderRadius: '8px', textDecoration: 'none', letterSpacing: '-0.01em',
                boxShadow: '0 0 22px rgba(124,58,237,0.32)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 36px rgba(124,58,237,0.55)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 22px rgba(124,58,237,0.32)';
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden"
          style={{
            padding: '8px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {isMobileOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid rgba(167,139,250,0.1)',
            background: 'rgba(5,5,8,0.97)',
            backdropFilter: 'blur(24px)',
            padding: '16px 24px 28px',
          }}
        >
          {[['/', 'Home'], ['#features', 'Features'], ['#pricing', 'Pricing']].map(([href, label]) => (
            <Link key={label} href={href} style={{
              display: 'block', padding: '12px 0',
              fontSize: '14px', fontWeight: 500,
              color: 'rgba(255,255,255,0.62)', textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {label}
            </Link>
          ))}
          <Link href="/api/auth/login" style={{
            display: 'block', marginTop: '20px', padding: '13px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#fff', fontWeight: 600, fontSize: '14px',
            borderRadius: '10px', textDecoration: 'none', textAlign: 'center',
            boxShadow: '0 0 28px rgba(124,58,237,0.35)',
          }}>
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
