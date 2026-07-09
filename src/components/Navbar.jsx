import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(253,240,244,0.97)' : 'rgba(253,240,244,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${scrolled ? '#F0B8CC' : 'transparent'}`,
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 2px 16px rgba(200,107,138,0.10)' : 'none',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
  <img
    src="/logo.jpg"
    alt="La Grande Mercerie"
    style={{
      height: '100%',
      maxHeight: '70px',
      width: 'auto',
      objectFit: 'contain',
    }}
  />
</Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
             className="nav-desktop">
          {[
            { to: '/',            label: 'Accueil'   },
            { to: '/catalogue',   label: 'Catalogue' },
            { to: '/a-propos',    label: 'À propos'  },
            { to: '/contact',     label: 'Contact'   },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-corps)',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--rose-profond)' : 'var(--noir)',
                textDecoration: 'none',
                fontSize: '0.9rem',
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
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px',
          }}
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: '24px', height: '2px',
              background: 'var(--rose-profond)',
              borderRadius: '2px',
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
          background: 'var(--blush)',
          borderTop: '1px solid var(--rose-poudre)',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          {[
            { to: '/',           label: 'Accueil'   },
            { to: '/catalogue',  label: 'Catalogue' },
            { to: '/a-propos',   label: 'À propos'  },
            { to: '/contact',    label: 'Contact'   },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                color: isActive ? 'var(--rose-profond)' : 'var(--noir)',
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
