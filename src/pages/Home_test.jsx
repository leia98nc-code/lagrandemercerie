import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { useMemo, useState } from 'react'

const UNIVERS = [
  { nom: 'Pelote',               lien: '/catalogue?cat=Pelote',                       photo: '/images/products/BAMBI_K.jpg' },
  { nom: 'Broderie',             lien: '/catalogue?cat=Broderie',                     photo: '/images/products/MOULINE_DMC.webp' },
  { nom: 'Velcros',              lien: '/catalogue?cat=Velcros',                      photo: '/images/products/460001.jpg' },
  { nom: 'Fils',                 lien: '/catalogue?cat=Fils',                         photo: '/images/products/1004-BLANC.webp' },
  { nom: 'Laine',                lien: '/catalogue?cat=Laine',                        photo: '/images/products/8143ASS.jpg' },
  { nom: 'Aiguilles & épingles', lien: '/catalogue?cat=Aiguilles+%26+%C3%A9pingles',  photo: '/images/products/18099.jpeg' },
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

      {/* ── Hero ── fond blush uni */}
      <section style={{
        background: 'var(--blush)',
        padding: '3rem 0 4rem',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,48,74,0.07) 0%, transparent 70%)',
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
                fontSize: '0.75rem', color: 'var(--rose-profond)',
                marginBottom: '0.75rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', fontWeight: 600,
              }}>
                Nouméa · Nouvelle-Calédonie
              </p>

              <img
                src="/logo.jpg"
                alt="La Grande Mercerie"
                style={{ maxWidth: '480px', width: '100%', height: 'auto', marginBottom: '1.25rem', display: 'block' }}
              />

              <p style={{
                fontSize: '1rem', color: 'var(--gris-texte)',
                maxWidth: '400px', lineHeight: 1.8,
                fontWeight: 300, marginBottom: '2rem',
              }}>
                Il y a des boutiques où l'on entre pour un bouton<br />
                et où l'on repart avec un projet.<br />
                Plus de 4 000 références sélectionnées avec soin.
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/catalogue" style={{
                  display: 'inline-block',
                  padding: '0.85rem 2rem',
                  background: 'var(--rose-profond)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-corps)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7a2038'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--rose-profond)'}
                >
                  Voir le catalogue
                </Link>

                <Link to="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  color: 'var(--noir)', textDecoration: 'none',
                  fontSize: '0.88rem', fontFamily: 'var(--font-corps)', fontWeight: 400,
                  borderBottom: '1.5px solid rgba(26,26,26,0.3)',
                  paddingBottom: '2px', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose-profond)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)'}
                >
                  Nous trouver →
                </Link>
              </div>

              {/* Étiquette horaires — style proposal */}
              <div style={{
                marginTop: '2rem',
                display: 'inline-flex',
                gap: '2rem',
                background: 'var(--blanc)',
                border: '1.5px solid var(--noir)',
                padding: '0.9rem 1.3rem',
              }}>
                <div>
                  <span style={{
                    display: 'block', marginBottom: '0.3rem',
                    fontSize: '0.68rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--gris-texte)', fontWeight: 600,
                  }}>Horaires</span>
                  <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--noir)' }}>
                    Lun–Ven : 8h–12h / 13h–17h30<br />
                    Samedi : 8h–12h<br />
                    <span style={{ color: 'var(--rose-profond)', fontWeight: 700 }}>Fermé le dimanche</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Photo boutique — style proposal avec coin cranté */}
            <div style={{
              position: 'relative',
              aspectRatio: '4 / 3.1',
              overflow: 'hidden',
              border: '3px solid var(--noir)',
              marginTop: '2rem',
              clipPath: 'polygon(0 0, 100% 0, 100% 94%, 96% 100%, 0 100%)',
            }}>
              <img
                src="/images/shop/home-rose.jpg"
                alt="La Grande Mercerie"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
              <figcaption style={{
                position: 'absolute', left: 0, bottom: 0,
                background: 'var(--rose-profond)', color: 'white',
                fontSize: '0.65rem', letterSpacing: '0.08em',
                padding: '0.4rem 0.8rem', fontWeight: 700, textTransform: 'uppercase',
              }}>
                Quartier latin — Nouméa
              </figcaption>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos univers ── fond blanc — style proposal (label burgundy sous photo) */}
      <section style={{ padding: '4rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.3rem' }}>
                Collections
              </p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', margin: 0 }}>
                Par où commencer ?
              </h2>
            </div>
            <Link to="/catalogue" style={{
              fontSize: '0.88rem', color: 'var(--noir)', textDecoration: 'none',
              borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '2px',
            }}>
              Tout voir →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
          }}>
            {UNIVERS.map(({ nom, lien, photo }) => (
              <Link key={nom} to={lien} style={{ textDecoration: 'none', color: 'var(--noir)', display: 'block' }}>
                <div
                  style={{ transition: 'transform 0.25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Photo carrée avec bordure */}
                  <div style={{
                    position: 'relative', aspectRatio: '1 / 1',
                    overflow: 'hidden', border: '2px solid var(--noir)',
                  }}>
                    <img
                      src={photo} alt={nom}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  </div>
                  {/* Label burgundy sous la photo */}
                  <div style={{
                    background: 'var(--rose-profond)', color: 'white',
                    textAlign: 'center', fontFamily: 'var(--font-titre)',
                    fontWeight: 600, fontSize: '0.88rem',
                    letterSpacing: '0.02em', padding: '0.5rem 0.3rem',
                  }}>
                    {nom}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coups de cœur ── fond blush */}
      {!loading && top20.length > 0 && (
        <section style={{ padding: '4rem 0', background: 'var(--blush)' }}>
          <div className="container">
            <div style={{ marginBottom: '2.2rem' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.3rem' }}>
                Popularité
              </p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: 0 }}>
                Ce que nos clientes adoptent en ce moment
              </h2>
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCarrouselIndex(i => (i - 4 + top20.length) % top20.length)}
                style={{
                  position: 'absolute', left: '-1.25rem', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--blanc)', color: 'var(--rose-profond)',
                  border: '1.5px solid var(--rose-poudre)',
                  cursor: 'pointer', fontSize: '1.4rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(160,48,74,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >‹</button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
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
                  background: 'var(--blanc)', color: 'var(--rose-profond)',
                  border: '1.5px solid var(--rose-poudre)',
                  cursor: 'pointer', fontSize: '1.4rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(160,48,74,0.2)' }}
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
              <Link to="/catalogue" style={{
                textDecoration: 'none', color: 'var(--noir)', fontSize: '0.9rem',
                borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '3px',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose-profond)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)'}
              >
                Voir tous les produits
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Réassurance ── fond burgundy cranté (style proposal) */}
      <section style={{
        background: 'var(--rose-profond)',
        color: 'white',
        padding: '3rem 0 4rem',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 93.75% 92%, 87.5% 100%, 81.25% 92%, 75% 100%, 68.75% 92%, 62.5% 100%, 56.25% 92%, 50% 100%, 43.75% 92%, 37.5% 100%, 31.25% 92%, 25% 100%, 18.75% 92%, 12.5% 100%, 6.25% 92%, 0% 100%)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.6rem',
          }}>
            {[
              { titre: '+4 000 références', texte: 'Fils, laines, tissus, boutons et accessoires réunis sous un même toit' },
              { titre: 'Conseil personnalisé', texte: 'Une équipe qui connaît ses produits et prend le temps de vous orienter' },
              { titre: 'Les meilleures marques', texte: 'DMC, Katia, Cheval Blanc, Bohin, Prym — rigoureusement choisis' },
              { titre: 'À Nouméa, en vrai', texte: 'Une boutique physique, du lundi au samedi, avec des personnes disponibles' },
            ].map(({ titre, texte }) => (
              <div key={titre}>
                <p style={{ fontFamily: 'var(--font-corps)', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 0.3rem', color: 'white' }}>{titre}</p>
                <p style={{ fontFamily: 'var(--font-corps)', fontSize: '0.78rem', lineHeight: 1.6, opacity: 0.85, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nous trouver + Facebook ── fond blanc 2 colonnes (style proposal) */}
      <section style={{ padding: '4.5rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
          }}>
            {/* Colonne gauche — Adresse & horaires */}
            <div>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Boutique
              </p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', margin: '0 0 1.1rem' }}>
                Nous trouver
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--gris-texte)', maxWidth: '38ch', marginBottom: '1rem' }}>
                Quartier latin — Nouméa, Nouvelle-Calédonie.
              </p>
              <div style={{ fontSize: '0.84rem', lineHeight: 1.8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.2rem 1.2rem' }}>
                  <span style={{ color: 'var(--gris-texte)' }}>Adresse</span>
                  <span>16 Route de l'Anse Vata, Nouméa</span>
                  <span style={{ color: 'var(--gris-texte)' }}>Lundi — vendredi</span>
                  <span>8h–12h / 13h–17h30</span>
                  <span style={{ color: 'var(--gris-texte)' }}>Samedi</span>
                  <span>8h–12h</span>
                  <span style={{ color: 'var(--gris-texte)' }}>Dimanche</span>
                  <span style={{ color: 'var(--rose-profond)', fontWeight: 700 }}>Fermé</span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/contact" style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.6rem',
                  background: 'var(--rose-profond)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-corps)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7a2038'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--rose-profond)'}
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Colonne droite — Facebook */}
            <div>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Actualités
              </p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', margin: '0 0 1.1rem' }}>
                La boutique continue en ligne
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--gris-texte)', maxWidth: '38ch', marginBottom: '1.25rem' }}>
                Nouveautés, arrivages et inspirations — retrouvez-nous sur Facebook entre deux visites.
              </p>
              <div style={{
                overflow: 'hidden', border: '2px solid var(--noir)',
                height: '320px', position: 'relative',
              }}>
                <iframe
                  title="Page Facebook La Grande Mercerie"
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FLagrandeMercerieNoumea&tabs=timeline&width=500&height=400&small_header=true&hide_cover=false&show_facepile=false"
                  width="100%" height="400"
                  style={{ border: 'none', overflow: 'hidden', marginTop: '-80px' }}
                  scrolling="no" frameBorder="0" allowFullScreen allow="encrypted-media"
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                
                  href="https://www.facebook.com/LagrandeMercerieNoumea"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none', color: 'var(--noir)', fontSize: '0.88rem',
                    borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '2px',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose-profond)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)'}
                >
                  Voir la page complète →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── fond blush rosé (style proposal) */}
      <section style={{ background: 'var(--blush)', padding: '3.8rem 0 4.2rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Newsletter
          </p>
          <h2 style={{
            fontFamily: 'var(--font-titre)', fontStyle: 'italic', fontWeight: 600,
            fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', margin: '0 0 0.6rem',
          }}>
            Restez dans la boucle — c'est le cas de le dire
          </h2>
          <p style={{ color: 'var(--gris-texte)', marginBottom: '1.4rem', fontSize: '0.95rem' }}>
            Nouveautés, arrivages et bons plans directement dans votre boîte mail. Sans excès.
          </p>
          {/* Formulaire inline style proposal */}
          <div style={{ display: 'flex', gap: '0', maxWidth: '440px' }}>
            <input
              type="email"
              placeholder="votre@email.com"
              aria-label="Adresse email"
              style={{
                flex: 1, padding: '0.75rem 1rem',
                border: '2px solid var(--noir)', borderRight: 'none',
                background: 'var(--blanc)', color: 'var(--noir)',
                fontFamily: 'var(--font-corps)', fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            
              href="https://app.zenkai.nc/lagrandemercerie/form-nl.html"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '0.75rem 1.3rem',
                background: 'var(--rose-profond)', color: 'white',
                border: '2px solid var(--rose-profond)',
                fontFamily: 'var(--font-corps)', fontWeight: 700,
                fontSize: '0.75rem', letterSpacing: '0.06em',
                textTransform: 'uppercase', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-flex',
                alignItems: 'center', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#7a2038'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--rose-profond)'}
            >
              Je m'inscris
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}