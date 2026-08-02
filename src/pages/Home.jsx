import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { useMemo, useState, useRef, useEffect } from 'react'

const UNIVERS = [
  { nom: 'Pelote',                lien: '/catalogue?cat=Pelote',                      photo: '/images/products/BAMBI_K.jpg' },
  { nom: 'Broderie',              lien: '/catalogue?cat=Broderie',                    photo: '/images/products/MOULINE_DMC.webp' },
  { nom: 'Velcros',               lien: '/catalogue?cat=Velcros',                     photo: '/images/products/460001.jpg' },
  { nom: 'Fils',                  lien: '/catalogue?cat=Fils',                        photo: '/images/products/1004-BLANC.webp' },
  { nom: 'Laine',                 lien: '/catalogue?cat=Laine',                       photo: '/images/products/8143ASS.jpg' },
  { nom: 'Aiguilles & épingles',  lien: '/catalogue?cat=Aiguilles+%26+%C3%A9pingles', photo: '/images/products/18099.jpeg' },
]
const PHOTOS_HERO = [
  '/images/shop/Tissus_tous2.jpg',
  '/images/shop/X_Bobine2.jpg',
  '/images/shop/X_Pelote_(4).jpg',
]
const PROMOS_HERO = [
  {
    photo: '/images/Pexel/pexels-anntarazevich-6358817.jpg',
    titre: 'Nouvelle collection',
    texte: 'Découvrez nos derniers arrivages',
  },
  {
    photo: '/images/FB/PRODUIT_MOIS.jpg',
    titre: 'Produit du mois',
    texte: 'Notre sélection coup de cœur à prix doux',
  },
  {
    photo: '/images/FB/HAPPY8COTTON.jpg',
    titre: 'Happy Cotton',
    texte: 'La douceur du coton, en édition limitée',
  },
  {
    photo: '/images/FB/LABUBU.jpg',
    titre: 'Tendance du moment',
    texte: 'Craquez pour nos kits amigurumi',
  },
]

export default function Home() {
  const { products, loading } = useProducts()

  // ── États : carrousel "Vos préférés du moment" ──
  const [carrouselIndex, setCarrouselIndex] = useState(0)
  const [carrouselEnPause, setCarrouselEnPause] = useState(false)
  const [nombreVisible, setNombreVisible] = useState(4)
  const carrouselRef = useRef(null)

  // ── États : carrousel promo du hero ──
  const [promoIndex, setPromoIndex] = useState(0)
  const [promoEnPause, setPromoEnPause] = useState(false)
  const colonneTexteRef = useRef(null)
  const [hauteurColonne, setHauteurColonne] = useState(null)
  const [photoHeroIndex, setPhotoHeroIndex] = useState(0)


  // ── Données dérivées ──
  const top20 = useMemo(() => {
    if (products.length === 0) return []
    return [...products]
      .filter(p => p.popularite && p.popularite < 99999)
      .sort((a, b) => a.popularite - b.popularite)
      .slice(0, 20)
  }, [products])

  
  // ── Effets : mesure de la hauteur de la colonne gauche du hero ──
  useEffect(() => {
  if (!colonneTexteRef.current) return
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      setHauteurColonne(entry.contentRect.height)
    }
  })
  observer.observe(colonneTexteRef.current)
  return () => observer.disconnect()
}, [])

  // ── Effets : défilement auto du carrousel promo ──
  useEffect(() => {
    if (promoEnPause || PROMOS_HERO.length <= 1) return
    const intervalle = setInterval(() => {
      setPromoIndex(i => (i + 1) % PROMOS_HERO.length)
    }, 4500)
    return () => clearInterval(intervalle)
  }, [promoEnPause])

  useEffect(() => {
  const intervalle = setInterval(() => {
    setPhotoHeroIndex(i => (i + 1) % PHOTOS_HERO.length)
  }, 4000)
  return () => clearInterval(intervalle)
}, [])

  // ── Effets : nombre de cartes visibles dans le carrousel produits ──
  useEffect(() => {
    const LARGEUR_CARTE = 220
    const GAP = 20
    const calculer = () => {
      if (!carrouselRef.current) return
      const largeurDispo = carrouselRef.current.offsetWidth
      const n = Math.max(1, Math.floor((largeurDispo + GAP) / (LARGEUR_CARTE + GAP)))
      setNombreVisible(n)
    }
    calculer()
    window.addEventListener('resize', calculer)
    return () => window.removeEventListener('resize', calculer)
  }, [])

  // ── Effets : défilement auto du carrousel produits ──
  useEffect(() => {
    if (carrouselEnPause || top20.length <= nombreVisible) return
    const intervalle = setInterval(() => {
      setCarrouselIndex(i => (i + nombreVisible) % top20.length)
    }, 4000)
    return () => clearInterval(intervalle)
  }, [carrouselEnPause, nombreVisible, top20.length])

  return (
    <main className="page">

      {/* ── Hero ── */}
<section className="hero" style={{
  background: '#FFFFFF',
  padding: '128px 0 4rem',
  marginTop: '-140px',
  overflow: 'hidden',
  position: 'relative',
}}>
  <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,48,74,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
  <div className="container">
<div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--rose-profond)', marginBottom: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
          {'Nouméa · Nouvelle-Calédonie'}
        </p>
<img src="/logo.jpg" alt="La Grande Mercerie" style={{ maxWidth: '360px', width: '100%', height: 'auto', marginBottom: '1.25rem', display: 'block' }} />        <h1 className='hero-titre'>Votre mercerie du <span style={{color: 'var(--rose-profond)'}}>Quartier latin</span> <br />à Nouméa</h1>
        <p style={{ fontSize: '1rem', color: 'var(--gris-texte)', maxWidth: '400px', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
          {'Fils, laines, tissus, boutons et accessoires couture —'}<br />
          {'Plus de 4 000 références sélectionnées avec soin.'}<br />
        </p>

        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            to="/catalogue"
            style={{ display: 'inline-block', padding: '0.85rem 2rem', background: 'var(--rose-profond)', color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'var(--font-corps)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '4px', transition: 'background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7a2038' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--rose-profond)' }}
          >
            {'Voir le catalogue'}
          </Link>
          <Link
            to="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--noir)', textDecoration: 'none', fontSize: '0.88rem', fontFamily: 'var(--font-corps)', fontWeight: 400, borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '2px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)' }}
          >
            {'Nous trouver →'}
          </Link>
        </div>
      </div>

{/* Colonne droite — carrousel simple */}
<div style={{ position: 'relative', aspectRatio: '4 / 3.1', overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: '0 12px 40px rgba(200,107,138,0.18)', marginTop: '2rem' }}>
  {PHOTOS_HERO.map((photo, i) => (
    <img
      key={photo}
      src={photo}
      alt="La Grande Mercerie"
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        opacity: i === photoHeroIndex ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  ))}
</div>

    </div>
  </div>
</section>


{/* ── Coups de coeur ── */}
      {!loading && top20.length > 0 && (
        <section style={{ padding: '4rem 0', background: 'var(--blush)' }}>
          <div className="container">
            <div style={{ marginBottom: '2.2rem' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.3rem' }}>{'Les usual suspects'}</p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: 0 }}>
                {'Vos préférés du moment'}
              </h2>
            </div>
            <div
  style={{ position: 'relative' }}
  onMouseEnter={() => setCarrouselEnPause(true)}
  onMouseLeave={() => setCarrouselEnPause(false)}
>
              <button
                onClick={() => setCarrouselIndex(i => (i + nombreVisible) % top20.length)}
                style={{ position: 'absolute', left: '-1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blanc)', color: 'var(--rose-profond)', border: '1.5px solid var(--rose-poudre)', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)' }}
              >
                {'‹'}
              </button>
              <div ref={carrouselRef} style={{
  display: 'grid',
  gridTemplateColumns: `repeat(${nombreVisible}, 1fr)`,
  gap: '1.25rem',
}}>
  {Array.from({ length: nombreVisible }).map((_, offset) => {
    const p = top20[(carrouselIndex + offset) % top20.length]
    return <ProductCard key={`${p.id}-${offset}`} product={p} />
  })}
</div>
              <button
                onClick={() => setCarrouselIndex(i => (i + 4) % top20.length)}
                style={{ position: 'absolute', right: '-1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blanc)', color: 'var(--rose-profond)', border: '1.5px solid var(--rose-poudre)', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rose-poudre)' }}
              >
                {'›'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarrouselIndex(i * 4)}
                  style={{ width: carrouselIndex >= i * 4 && carrouselIndex < (i + 1) * 4 ? '20px' : '7px', height: '7px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: carrouselIndex >= i * 4 && carrouselIndex < (i + 1) * 4 ? 'var(--rose-profond)' : 'var(--rose-poudre)', transition: 'all 0.3s ease', padding: 0 }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link
                to="/catalogue"
                style={{ textDecoration: 'none', color: 'var(--noir)', fontSize: '0.9rem', borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '3px', transition: 'border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)' }}
              >
                {'Voir tous les produits'}
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* ── Nos univers ── */}
      <section style={{ padding: '4rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.3rem' }}>{'Nos rayons'}</p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', margin: 0 }}>{'Par où commencer ?'}</h2>
              </div>
            <Link to="/catalogue" style={{ fontSize: '0.88rem', color: 'var(--noir)', textDecoration: 'none', borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '2px' }}>
              {'Tout voir →'}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            {UNIVERS.map(({ nom, lien, photo }) => (
              <Link key={nom} to={lien} style={{ textDecoration: 'none', color: 'var(--noir)', display: 'block' }}>
                <div
                  style={{ transition: 'transform 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: '0 12px 40px rgba(200,107,138,0.18)' }}>
  <img src={photo} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} />
</div>
<div style={{ background: 'var(--rose-profond)', color: 'white', textAlign: 'center', fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.02em', padding: '0.5rem 0.3rem' }}>
  {nom}
</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      

      {/* ── Reassurance crantee ── */}
      <section style={{ background: 'var(--rose-profond)', color: 'white', padding: '3rem 0 4rem', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 93.75% 92%, 87.5% 100%, 81.25% 92%, 75% 100%, 68.75% 92%, 62.5% 100%, 56.25% 92%, 50% 100%, 43.75% 92%, 37.5% 100%, 31.25% 92%, 25% 100%, 18.75% 92%, 12.5% 100%, 6.25% 92%, 0% 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.6rem' }}>
  {[
  { titre: '+4 000 références',     texte: 'Fils, laines, tissus, boutons et accessoires' },
  { titre: 'Conseil personnalisé',   texte: 'Une équipe qui connaît ses produits et prend le temps de vous orienter' },
  { titre: 'Les meilleures marques', texte: 'DMC, Katia, Cheval Blanc, Bohin, Prym — rigoureusement choisis' },
  { titre: 'À Nouméa, en vrai',      texte: 'Une boutique physique, du lundi au samedi, avec des personnes disponibles' },
].map(({ titre, texte }) => (
    <div key={titre} style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-corps)', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.4rem', color: 'white' }}>{titre}</p>
      <p style={{ fontFamily: 'var(--font-corps)', fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.85, margin: 0 }}>{texte}</p>
    </div>
  ))}
</div>
        </div>
      </section>

{/* ── Nous trouver + Facebook ── */}
      <section style={{ padding: '4.5rem 0', background: 'var(--blanc)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>

            {/* Colonne gauche — Nous trouver */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.4rem' }}>{'Boutique'}</p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', margin: '0 0 1.1rem' }}>{'Nous rendre visite'}</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--gris-texte)', maxWidth: '38ch', marginBottom: '1rem' }}>
                {'Quartier latin — Nouméa, Nouvelle-Calédonie.'}
              </p>
              <div style={{ fontSize: '0.84rem', lineHeight: 1.8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.2rem 1.2rem' }}>
                  <span style={{ color: 'var(--gris-texte)' }}>{'Adresse'}</span>
                  <span>{"16 Route de l'Anse Vata, Nouméa"}</span>
                  <span style={{ color: 'var(--gris-texte)' }}>{'Lundi — vendredi'}</span>
                  <span>{'8h–17h30'}</span>
                  <span style={{ color: 'var(--gris-texte)' }}>{'Samedi'}</span>
                  <span>{'8h–12h'}</span>
                  <span style={{ color: 'var(--gris-texte)' }}>{'Dimanche'}</span>
                  <span style={{ color: 'var(--rose-profond)', fontWeight: 700 }}>{'Fermé'}</span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <Link
                  to="/contact"
                  style={{ display: 'inline-block', padding: '0.75rem 1.6rem', background: 'var(--rose-profond)', color: 'white', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'var(--font-corps)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '4px', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#7a2038' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--rose-profond)' }}
                >
                  {'Nous contacter'}
                </Link>
              </div>

              {/* Google Maps — prend tout l'espace restant */}
<div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: '0 12px 40px rgba(200,107,138,0.18)', marginTop: '2rem', height: '450px' }}>
                  <iframe
                  title="Localisation La Grande Mercerie"
                  src="https://maps.google.com/maps?q=-22.276753,166.447583&z=15&t=m&output=embed&hl=fr"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', display: 'block' }}
                  loading="lazy"
                  allowFullScreen={false}
                />
              </div>
            </div>

            {/* Colonne droite — Facebook */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600, marginBottom: '0.4rem' }}>{'Actualités'}</p>
              <h2 style={{ fontFamily: 'var(--font-titre)', fontWeight: 600, fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', margin: '0 0 1.1rem' }}>{'Suivez nous sur les réseaux'}</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--gris-texte)', maxWidth: '38ch', marginBottom: '1.25rem' }}>
                {'Nouveautés, arrivages et inspirations — retrouvez-nous sur Facebook entre deux visites.'}
              </p>

              {/* Facebook — taille naturelle, centré dans l'espace disponible */}
<div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: '0 12px 40px rgba(200,107,138,0.18)', position: 'relative', height: '590px', display: 'flex', justifyContent: 'center' }}>  <iframe
    title="Page Facebook La Grande Mercerie"
    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FLagrandeMercerieNoumea&tabs=timeline&width=500&height=1000&small_header=true&hide_cover=false&show_facepile=false"
    width="500"
    height="1000"
    style={{ border: 'none', overflow: 'hidden', marginTop: '-80px', display: 'block', flexShrink: 0 }}
    scrolling="no"
    frameBorder="0"
    allowFullScreen={true}
    allow="encrypted-media"
  />
</div>

              <div style={{ marginTop: '1rem' }}>
                <a
                  href="https://www.facebook.com/LagrandeMercerieNoumea"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'var(--noir)', fontSize: '0.88rem', borderBottom: '1.5px solid rgba(26,26,26,0.3)', paddingBottom: '2px', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose-profond)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.3)' }}
                >
                  {'Voir la page complète →'}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
<section style={{ padding: '3rem 0' }}>
  <div className="container" style={{ maxWidth: '1000px' }}>
    <div style={{
      background: 'var(--blanc)',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: '2rem 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.5rem',
    }}>
      <div>
        <p style={{
          fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--ocre)', fontWeight: 700, marginBottom: '0.4rem',
        }}>
          {'Newsletter'}
        </p>

        <h2 style={{
          fontFamily: 'var(--font-titre)', fontWeight: 600,
          fontSize: 'clamp(1.4rem, 2.4vw, 1.8rem)', color: 'var(--noir)',
          margin: '0 0 0.4rem',
        }}>
          {'Restez dans la boucle'}
        </h2>

        <p style={{
          color: 'var(--gris-texte)', fontSize: '0.95rem',
          maxWidth: '440px', lineHeight: 1.6, margin: 0,
        }}>
          {'Nouveautés, arrivages et bons plans directement dans votre boîte mail. Sans excès.'}
        </p>
      </div>

      <a
        href="https://app.zenkai.nc/lagrandemercerie/form-nl.html"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '0.9rem 2.2rem', background: 'var(--rose-profond)', color: 'white',
          border: 'none', borderRadius: '50px',
          fontFamily: 'var(--font-corps)', fontWeight: 700, fontSize: '0.85rem',
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          textDecoration: 'none', display: 'inline-block', flexShrink: 0,
          transition: 'background 0.15s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#7a2038'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--rose-profond)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {"Je m'inscris"}
      </a>
    </div>
  </div>
</section>
<style>{`
  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr !important; }
  }
`}</style>
    </main>
  )
}
