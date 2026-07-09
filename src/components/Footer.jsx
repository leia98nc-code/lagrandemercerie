import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--noir)',
      color: 'var(--rose-poudre)',
      padding: '3rem 0 1.5rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Colonne marque */}
          <div>
            <div style={{
              fontFamily: 'var(--font-titre)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--rose-profond)',
              marginBottom: '0.5rem',
            }}>
              La Grande Mercerie
            </div>
            <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: 1.7, fontWeight: 300 }}>
              Votre boutique d'accessoires crochet, tricot et couture.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-corps)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--rose-poudre)',
              marginBottom: '1rem',
            }}>Navigation</h4>
            {[
              { to: '/',           label: 'Accueil'   },
              { to: '/catalogue',  label: 'Catalogue' },
              { to: '/a-propos',   label: 'À propos'  },
              { to: '/contact',    label: 'Contact'   },
            ].map(({ to, label }) => (
              <div key={to} style={{ marginBottom: '0.5rem' }}>
                <Link to={to} style={{
                  color: '#bbb', textDecoration: 'none', fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--rose-poudre)'}
                  onMouseLeave={e => e.target.style.color = '#bbb'}
                >{label}</Link>
              </div>
            ))}
          </div>

          {/* Légal */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-corps)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--rose-poudre)',
              marginBottom: '1rem',
            }}>Informations</h4>
            <div style={{ marginBottom: '0.5rem' }}>
              <Link to="/mentions-legales" style={{
                color: '#bbb', textDecoration: 'none', fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--rose-poudre)'}
                onMouseLeave={e => e.target.style.color = '#bbb'}
              >Mentions légales & RGPD</Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '1.25rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#666',
        }}>
          © {year} La Grande Mercerie — Tous droits réservés
        </div>
      </div>
    </footer>
  )
}
