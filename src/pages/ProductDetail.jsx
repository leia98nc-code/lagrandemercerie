import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'

function VisualiseurZoom({ src, alt, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoomVisible, setZoomVisible] = useState(false)
  const [tailleImage, setTailleImage] = useState({ width: 0, height: 0 })
  const TAILLE_LOUPE = 180
  const FACTEUR_ZOOM = 2.5

  const gererMouvement = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setTailleImage({ width: rect.width, height: rect.height })
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(26,26,26,0.95)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)', border: 'none',
        color: 'white', fontSize: '1.5rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>

      <p style={{
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        color: 'white', fontSize: '0.85rem', opacity: 0.8,
      }}>🔍 Déplace la souris sur l'image pour zoomer</p>

      <div
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => setZoomVisible(true)}
        onMouseLeave={() => setZoomVisible(false)}
        onMouseMove={gererMouvement}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', cursor: 'crosshair' }}
      >
        <img
          src={src} alt={alt}
          style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block', borderRadius: 'var(--radius)' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        {zoomVisible && tailleImage.width > 0 && (
          <div style={{
            position: 'absolute',
            top: position.y - TAILLE_LOUPE / 2,
            left: position.x - TAILLE_LOUPE / 2,
            width: TAILLE_LOUPE, height: TAILLE_LOUPE,
            borderRadius: '50%', border: '3px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)', pointerEvents: 'none',
            backgroundImage: `url(${src})`, backgroundRepeat: 'no-repeat',
            backgroundSize: `${tailleImage.width * FACTEUR_ZOOM}px ${tailleImage.height * FACTEUR_ZOOM}px`,
            backgroundPosition: `${-(position.x * FACTEUR_ZOOM - TAILLE_LOUPE / 2)}px ${-(position.y * FACTEUR_ZOOM - TAILLE_LOUPE / 2)}px`,
          }} />
        )}
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const navigate = useNavigate()

  const [gammeActive, setGammeActive] = useState(null)
  const [zoomOuvert, setZoomOuvert] = useState(false)
  const EXTENSIONS = ['jpg', 'webp', 'jpeg', 'png']
  const [extensionIndex, setExtensionIndex] = useState(0)

  useEffect(() => { setZoomOuvert(false) }, [id])
  useEffect(() => { setExtensionIndex(0) }, [gammeActive])

  const product = products.find(p => p.id === id)

  if (loading) return (
    <main className="page" style={{ textAlign: 'center', padding: '5rem' }}>
      <img src="/logo.jpg" alt="" style={{ width: '64px', opacity: 0.5, marginBottom: '1rem' }} />
      <p style={{ color: 'var(--gris-texte)' }}>Chargement...</p>
    </main>
  )

  if (!product) return (
    <main className="page">
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <h2 style={{ fontFamily: 'var(--font-titre)', marginBottom: '1rem' }}>Produit introuvable</h2>
        <Link to="/catalogue" className="btn-primary">Retour au catalogue</Link>
      </div>
    </main>
  )

  const { nom, categorie, prix, description, dispo, image } = product

  const suffixGamme = gammeActive
    ? gammeActive.trim()
        .replace(/\s*-\s*/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9_-]/g, '')
    : null

  const imageAffichee = suffixGamme
    ? `${product.id}_${suffixGamme}.${EXTENSIONS[extensionIndex]}`
    : image

  const similaires = products
    .filter(p => p.id !== id && p.categorie === categorie)
    .sort((a, b) => (a.popularite || 99999) - (b.popularite || 99999))
    .slice(0, 4)

  return (
    <main className="page" style={{ padding: '2rem 0 4rem', background: 'var(--blush)' }}>
      <div className="container">

        {/* Fil d'Ariane */}
        <nav style={{
          fontSize: '0.82rem', color: 'var(--gris-texte)',
          marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
        }}>
          <Link to="/" style={{ color: 'var(--rose-profond)', textDecoration: 'none' }}>Accueil</Link>
          <span>›</span>
          <Link to="/catalogue" style={{ color: 'var(--rose-profond)', textDecoration: 'none' }}>Catalogue</Link>
          <span>›</span>
          <span>{nom}</span>
        </nav>

        {/* Fiche produit */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          background: 'var(--blanc)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '3rem',
        }}>

          {/* Image */}
          <div style={{
            aspectRatio: '1 / 1',
            background: 'var(--blush)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: 'url(/logo.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '30%',
          }}>
            {imageAffichee && (
              <img
                src={`/images/products/${imageAffichee}`}
                alt=""
                onClick={() => setZoomOuvert(true)}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '84%', height: '84%',
                  objectFit: 'contain', objectPosition: 'center',
                  transition: 'opacity 0.3s ease',
                  cursor: 'zoom-in',
                }}
                onError={e => {
                  if (suffixGamme && extensionIndex < EXTENSIONS.length - 1) {
                    setExtensionIndex(i => i + 1)
                  } else if (image) {
                    e.target.src = `/images/products/${image}`
                  } else {
                    e.target.style.display = 'none'
                  }
                }}
              />
            )}
          </div>

          {/* Infos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <span style={{
              fontSize: '0.75rem', textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--rose-profond)', fontWeight: 700,
            }}>
              {categorie}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-titre)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: 'var(--noir)', lineHeight: 1.2,
            }}>
              {nom}
            </h1>

            <div style={{
              fontFamily: 'var(--font-titre)',
              fontSize: '2rem', fontWeight: 700, color: 'var(--rose-profond)',
            }}>
              {prix > 0 ? `${prix.toLocaleString('fr-FR')} F` : 'Prix sur demande'}
            </div>

            {/* Disponibilité */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '50px', width: 'fit-content',
              background: dispo ? 'rgba(160,48,74,0.08)' : 'rgba(150,150,150,0.1)',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
                background: dispo ? 'var(--rose-profond)' : '#999',
              }} />
              <span style={{
                fontSize: '0.85rem', fontWeight: 700,
                color: dispo ? 'var(--rose-profond)' : '#999',
              }}>
                {(() => {
                  const stockActuel = gammeActive && product.stocks_gammes[gammeActive] !== undefined
                    ? product.stocks_gammes[gammeActive]
                    : product.stock
                  if (!dispo) return 'Indisponible'
                  if (stockActuel <= 0) return 'Indisponible pour cette gamme'
                  if (stockActuel <= 3) return 'Stock limité'
                  return 'En stock'
                })()}
              </span>
            </div>

            {/* Marque */}
            {product.marque && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.85rem', color: 'var(--gris-texte)',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--noir)' }}>Marque :</span>
                {product.marque}
              </div>
            )}

            {/* Description */}
            {description && (
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-corps)', fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--rose-profond)', marginBottom: '0.5rem',
                }}>
                  Description
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--noir)' }}>
                  {description}
                </p>
              </div>
            )}

            {/* Gammes */}
            {product.gammes && product.gammes.trim() !== '' && (
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-corps)', fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--rose-profond)', marginBottom: '0.75rem',
                }}>
                  Gammes disponibles
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {product.gammes.split('|').map((gamme, i) => {
                    const gTrim = gamme.trim()
                    const actif = gammeActive === gTrim
                    return (
                      <button
                        key={i}
                        onClick={() => setGammeActive(actif ? null : gTrim)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '4px',
                          border: `1.5px solid ${actif ? 'var(--rose-profond)' : 'var(--rose-poudre)'}`,
                          background: actif ? 'var(--rose-profond)' : 'var(--blanc)',
                          color: actif ? 'white' : 'var(--noir)',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-corps)',
                          fontWeight: actif ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                          if (!actif) {
                            e.currentTarget.style.borderColor = 'var(--rose-profond)'
                            e.currentTarget.style.color = 'var(--rose-profond)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!actif) {
                            e.currentTarget.style.borderColor = 'var(--rose-poudre)'
                            e.currentTarget.style.color = 'var(--noir)'
                          }
                        }}
                      >
                        {gTrim}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">Nous contacter</Link>
              <button onClick={() => navigate(-1)} className="btn-outline">← Retour</button>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similaires.length > 0 && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-titre)', fontSize: '1.5rem',
              marginBottom: '1.5rem', color: 'var(--noir)',
            }}>
              Dans la même catégorie
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}>
              {similaires.map(p => (
                <Link key={p.id} to={`/produit/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--blanc)', borderRadius: 'var(--radius)',
                      padding: '1rem', boxShadow: 'var(--shadow-card)', transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <p style={{ fontFamily: 'var(--font-titre)', fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--noir)' }}>{p.nom}</p>
                    <p style={{ color: 'var(--rose-profond)', fontWeight: 700 }}>{p.prix.toLocaleString('fr-FR')} F</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {zoomOuvert && (
        <VisualiseurZoom
          src={`/images/products/${imageAffichee}`}
          alt={nom}
          onClose={() => setZoomOuvert(false)}
        />
      )}
    </main>
  )
}