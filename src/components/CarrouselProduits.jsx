import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'

// Carrousel de produits réutilisable : on lui donne une liste de produits,
// un surtitre, un titre et une couleur de fond, il s'occupe du reste
// (défilement automatique, flèches, points, adaptation à la largeur d'écran).
// Chaque carrousel de la page a ainsi son propre état, indépendant des autres.

const LARGEUR_CARTE = 220
const GAP = 20

const styleFleche = (cote) => ({
  position: 'absolute', [cote]: '-1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blanc)', color: 'var(--rose-profond)',
  border: '1.5px solid var(--rose-poudre)', cursor: 'pointer', fontSize: '1.4rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s',
})

const styleLien = {
  textDecoration: 'none', color: 'var(--noir)', fontSize: '0.9rem',
  borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '3px', transition: 'border-color 0.15s',
}

export default function CarrouselProduits({ produits, surtitre, titre, fond = 'var(--blush)', liens = [], delai = 4000 }) {
  const [index, setIndex] = useState(0)
  const [enPause, setEnPause] = useState(false)
  const [nombreVisible, setNombreVisible] = useState(4)
  const grilleRef = useRef(null)

  const total = produits.length
  // Jamais plus de cartes affichées que de produits disponibles (évite les doublons)
  const visible = Math.max(1, Math.min(nombreVisible, total))
  const nbPages = Math.ceil(total / visible)
  const pageCourante = Math.floor(index / visible)

  const suivant = () => setIndex(i => (i + visible >= total ? 0 : i + visible))
  const precedent = () => setIndex(i => (i === 0 ? (nbPages - 1) * visible : i - visible))

  // Nombre de cartes selon la largeur disponible (2 sur mobile)
  useEffect(() => {
    const calculer = () => {
      if (window.innerWidth < 768) { setNombreVisible(2); return }
      if (!grilleRef.current) return
      const largeurDispo = grilleRef.current.offsetWidth
      setNombreVisible(Math.max(2, Math.floor((largeurDispo + GAP) / (LARGEUR_CARTE + GAP))))
    }
    calculer()
    window.addEventListener('resize', calculer)
    return () => window.removeEventListener('resize', calculer)
  }, [])

  // Si le nombre de cartes visibles change (redimensionnement), on repart du début
  useEffect(() => { setIndex(0) }, [visible])

  // Défilement automatique, suspendu au survol de la souris
  useEffect(() => {
    if (enPause || total <= visible) return
    const intervalle = setInterval(suivant, delai)
    return () => clearInterval(intervalle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enPause, total, visible, delai])

  if (total === 0) return null

  return (
    <section style={{ padding: '4rem 0', background: fond }}>
      <div className="container">
        <div style={{ marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.3rem' }}>{surtitre}</p>
          <h2 style={{ fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: 0 }}>{titre}</h2>
        </div>

        <div style={{ position: 'relative' }} onMouseEnter={() => setEnPause(true)} onMouseLeave={() => setEnPause(false)}>
          {total > visible && (
            <button aria-label="Produits précédents" onClick={precedent} style={styleFleche('left')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)' }}
            >{'‹'}</button>
          )}

          <div ref={grilleRef} style={{ display: 'grid', gridTemplateColumns: `repeat(${visible}, 1fr)`, gap: '1.25rem' }}>
            {Array.from({ length: visible }).map((_, offset) => {
              const p = produits[(index + offset) % total]
              return <ProductCard key={`${p.id}-${offset}`} product={p} />
            })}
          </div>

          {total > visible && (
            <button aria-label="Produits suivants" onClick={suivant} style={styleFleche('right')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)' }}
            >{'›'}</button>
          )}
        </div>

        {nbPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
            {Array.from({ length: nbPages }).map((_, i) => (
              <button
                key={i}
                aria-label={`Page ${i + 1}`}
                onClick={() => setIndex(i * visible)}
                style={{ width: i === pageCourante ? '20px' : '7px', height: '7px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: i === pageCourante ? 'var(--rose-profond)' : 'var(--rose-poudre)', transition: 'all 0.3s ease', padding: 0 }}
              />
            ))}
          </div>
        )}

        {liens.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {liens.map(({ texte, vers }) => (
              <Link key={vers} to={vers} style={styleLien}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)' }}
              >{texte}</Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}