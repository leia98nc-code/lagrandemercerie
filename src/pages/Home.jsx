import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { useMemo, useState } from 'react'

const UNIVERS = [
  { nom: 'Pelote',              lien: '/catalogue?cat=Pelote',                  photo: '/images/products/BAMBI_K.jpg' },
  { nom: 'Broderie',            lien: '/catalogue?cat=Broderie',                photo: '/images/products/MOULINE_DMC.webp' },
  { nom: 'Velcros', lien: '/catalogue?cat=Velcros', photo: '/images/products/460001.jpg' },
  { nom: 'Fils',                lien: '/catalogue?cat=Fils',                    photo: '/images/products/1004-BLANC.webp' },
  { nom: 'Laine',               lien: '/catalogue?cat=Laine',                   photo: '/images/products/8143ASS.jpg' },
  { nom: 'Aiguilles & épingles',lien: '/catalogue?cat=Aiguilles+%26+%C3%A9pingles', photo: '/images/products/18099.jpeg' },
]

export default function Home() {
  const [carrouselIndex, setCarrouselIndex] = useState(0)
  const { products, loading } = useProducts()

  const top20 = useMemo(() => {
    if (products.length === 0) return []
    return [...products]
      .filter(p => p.popularite && p.popularite < 99999)
      .sort((a, b) => a.popularite - b.popularite)
      .slice(0, 20)
  }, [products])

  return (
    <main className="page">

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--blush) 0%, #fff 55%, var(--rose-poudre) 100%)',
        padding: '3rem 0 4rem',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,184,204,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}>
            <div>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--rose-profond)',
                marginBottom: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}>
                Nouméa · Nouvelle-Calédonie 
              </p>

              <img
  src="/logo.jpg"
  alt="La Grande Mercerie"
  style={{
    maxWidth: '480px',
    width: '100%',
    height: 'auto',
    marginBottom: '1.25rem',
    display: 'block',
  }}
/>
              
              <p style={{
                fontSize: '1rem',
                color: 'var(--gris-texte)',
                maxWidth: '400px',
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: '2rem',
              }}>
                La mercerie rose du Quartier latin. Fils, laines, tissus, boutons et accessoires couture. Plus de 4 000 références sélectionnées avec soin.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/catalogue" className="btn-primary">Voir le catalogue</Link>
                <Link to="/contact" className="btn-outline">Nous trouver</Link>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: 'var(--radius)',
                borderLeft: '3px solid var(--rose-profond)',
                fontSize: '0.82rem',
                color: 'var(--gris-texte)',
                maxWidth: '340px',
                lineHeight: 1.7,
              }}>
                <span style={{ fontWeight: 700, color: 'var(--noir)', display: 'block', marginBottom: '0.3rem' }}>
                  Horaires d'ouverture
                </span>
                Lun–Ven : 8h – 12h · 13h – 17h30<br />
                Samedi : 8h – 12h · 13h – 16h30<br />
                <span style={{ color: 'var(--rose-profond)', fontWeight: 600 }}>Fermé le dimanche</span>
              </div>
            </div>

            <div style={{
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: '0 12px 40px rgba(200,107,138,0.18)',
  aspectRatio: '4/3',
  marginTop: '2rem',
}}>
              <div style={{
  aspectRatio: '4/3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
}}>
  <img
    src="/images/shop/home-rose.jpg"
    alt="La Grande Mercerie"
    style={{ maxWidth: '90%', maxHeight: '90%', width: 'auto', height: 'auto', objectFit: 'contain' }}
  />
</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos univers ── */}
      <section style={{ padding: '4rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div className="section-titre" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600 }}>
              Nos univers
            </h2>
            <p>Explorez nos produits par catégorie </p>
            <span className="trait" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1rem',
          }}>
            {UNIVERS.map(({ nom, lien, photo }) => (
              <Link key={nom} to={lien} style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,107,138,0.22)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Photo */}
                  <img
                    src={photo}
                    alt={nom}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Overlay dégradé */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(26,26,26,0.65) 0%, transparent 55%)',
                  }} />
                  {/* Nom */}
                  <p style={{
                    position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem',
                    fontFamily: 'var(--font-titre)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'white',
                    letterSpacing: '0.02em',
                    margin: 0,
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}>
                    {nom}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meilleures ventes ── */}
      {!loading && top20.length > 0 && (
        <section style={{ padding: '4rem 0', background: '#FDF8F5' }}>
          <div className="container">
            <div className="section-titre" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600 }}>
                Vos coups de coeur
              </h2>
              <p>Les produits les plus populaires</p>
              <span className="trait" />
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCarrouselIndex(i => (i - 4 + top20.length) % top20.length)}
                style={{
                  position: 'absolute', left: '-1.25rem', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'white', color: 'var(--rose-profond)',
                  border: '1.5px solid var(--rose-poudre)',
                  cursor: 'pointer', fontSize: '1.4rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(200,107,138,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >‹</button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}>
                {[0, 1, 2, 3].map(offset => {
                  const p = top20[(carrouselIndex + offset) % top20.length]
                  return <ProductCard key={`${p.id}-${offset}`} product={p} />
                })}
              </div>

              <button
                onClick={() => setCarrouselIndex(i => (i + 4) % top20.length)}
                style={{
                  position: 'absolute', right: '-1.25rem', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'white', color: 'var(--rose-profond)',
                  border: '1.5px solid var(--rose-poudre)',
                  cursor: 'pointer', fontSize: '1.4rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(200,107,138,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >›</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setCarrouselIndex(i * 4)}
                  style={{
                    width: carrouselIndex >= i * 4 && carrouselIndex < (i + 1) * 4 ? '20px' : '7px',
                    height: '7px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                    background: carrouselIndex >= i * 4 && carrouselIndex < (i + 1) * 4 ? 'var(--rose-profond)' : 'var(--rose-poudre)',
                    transition: 'all 0.3s ease', padding: 0,
                  }}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/catalogue" className="btn-outline">Voir tous les produits</Link>
            </div>
          </div>
        </section>
      )}

      

      {/* ── Facebook ── */}
      <section style={{ padding: '4rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div className="section-titre" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600 }}>
              Nos dernières nouvelles
            </h2>
            <p>Retrouvez-nous sur Facebook</p>
            <span className="trait" />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center', overflow: 'hidden',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
            maxWidth: '500px', margin: '0 auto 1.5rem',
          }}>
            <iframe
              title="Page Facebook La Grande Mercerie"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FLagrandeMercerieNoumea&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
              width="500" height="500"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no" frameBorder="0" allowFullScreen={true} allow="encrypted-media"
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="https://www.facebook.com/LagrandeMercerieNoumea" target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ background: '#1877F2' }}>
              📘 Voir la page complète
            </a>
          </div>
        </div>
      </section>

      {/* ── Réassurance ── */}
      <section style={{ padding: '2.5rem 0', background: '#FDF8F5' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { icon: '🧵', titre: '+4 000 références', texte: 'Fils, laines, tissus, boutons et accessoires' },
              { icon: '💌', titre: 'Conseil expert',    texte: 'Une équipe passionnée à votre écoute' },
              { icon: '✨', titre: 'Grandes marques',   texte: 'DMC, Cheval Blanc, Bohin, Katia...' },
              { icon: '📍', titre: 'Boutique à Nouméa', texte: 'Ouverte du lundi au samedi' },
            ].map(({ icon, titre, texte }) => (
              <div key={titre} style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                padding: '1.1rem 1.25rem',
                background: 'var(--blush)',
                borderRadius: 'var(--radius)',
              }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--noir)', marginBottom: '0.15rem' }}>{titre}</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--gris-texte)', lineHeight: 1.5 }}>{texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, var(--rose-poudre) 0%, var(--rose-profond) 100%)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <h2 style={{
            fontFamily: 'var(--font-titre)',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: 'white',
            marginBottom: '0.75rem',
          }}>
            Restez informées
          </h2>
          <p style={{ color: 'white', opacity: 0.9, marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Nouveautés, promotions et actualités — directement dans votre boîte mail.
          </p>
          <a href="https://app.zenkai.nc/lagrandemercerie/form-nl.html" target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ background: 'white', color: 'var(--rose-profond)', display: 'inline-block' }}>
            Je m'inscris à la newsletter
          </a>
        </div>
      </section>

    </main>
  )
}
