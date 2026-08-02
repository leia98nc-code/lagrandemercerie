import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showLogo = true
  const compact = scrolled && !hovered

  const liens = [
    { to: '/',          label: 'Accueil'   },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/a-propos',  label: 'À propos'  },
    { to: '/contact',   label: 'Contact'   },
  ]

  return (
    <header
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#FFFCF8' }}
>

      {/* ── Bandeau supérieur ── */}
      <div style={{
        background: '#FFFCF8',
        borderBottom: '1px solid rgba(23,17,15,0.14)',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        fontSize: '0.68rem',
        letterSpacing: '0.06em',
        color: '#7A6B66',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.4rem',
        maxHeight: compact ? '0' : '2.2rem',
        overflow: 'hidden',
        opacity: compact ? 0 : 1,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
      }}>
        <span>{'NOUMÉA · QUARTIER LATIN'}</span>
        <span>{'LUN–VEN 8H–17H30 · SAM 8H–12H'}</span>
      </div>

      {/* ── Barre principale ── */}
      <div style={{
        background: '#FFFCF8',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(23,17,15,0.14)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: compact ? '44px' : '72px',
          transition: 'height 0.35s ease',
        }}>

          {/* Logo encerclé + nom */}
          <Link to="/" style={{
            textDecoration: 'none', color: '#17110F',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            opacity: compact ? 0 : (showLogo ? 1 : 0),
            maxWidth: compact ? '0' : '300px',
            overflow: 'hidden',
            pointerEvents: (compact || !showLogo) ? 'none' : 'auto',
            transition: 'opacity 0.25s ease, max-width 0.35s ease',
            whiteSpace: 'nowrap',
          }}>
            <div style={{
  height: '38px', width: '38px',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '2px solid var(--rose-poudre)',
  boxSizing: 'border-box',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
}}>
  <img
    src="/favicon.jpg"
    alt="La Grande Mercerie"
    style={{ width: '71%', height: '71%', objectFit: 'contain', display: 'block' }}
  />
</div>
            <span style={{
              fontFamily: 'var(--font-titre)',
              fontWeight: 600,
              fontSize: '1.05rem',
              letterSpacing: '0.01em',
            }}>
              {'La Grande Mercerie'}
            </span>
          </Link>

          {/* Nav desktop */}
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="nav-desktop">
            {liens.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-corps)',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? 'var(--rose-profond)' : '#17110F',
                  textDecoration: 'none',
                  fontSize: compact ? '0.8rem' : '0.88rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  paddingBottom: '4px',
                  borderBottom: isActive ? '2px solid var(--rose-profond)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="nav-burger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '24px', height: '2px',
                background: 'var(--rose-profond)', borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px,-5px)'
                  : 'none',
              }} />
            ))}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div style={{
            background: '#FFFCF8',
            borderTop: '1px solid rgba(23,17,15,0.14)',
            padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            {liens.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--rose-profond)' : '#17110F',
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-titre)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-burger  { display: none  !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none  !important; }
          .nav-burger  { display: flex  !important; }
        }
      `}</style>
    </header>
  )
}
