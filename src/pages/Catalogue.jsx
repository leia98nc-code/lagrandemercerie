import { useState, useMemo, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { useSearchParams, Link } from 'react-router-dom'

function echapperRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function surlignerTexte(texte, terme) {
  if (!texte) return texte
  const termeNettoye = terme.replace(/^=/, '').replace(/^"(.+)"$/, '$1').trim()
  if (!termeNettoye) return texte
  const regex = new RegExp(`(${echapperRegex(termeNettoye)})`, 'gi')
  const parties = texte.split(regex)
  if (parties.length === 1) return texte
  return parties.map((partie, i) =>
    i % 2 === 1 ? (
      <mark key={i} style={{ background: 'var(--rose-poudre)', color: 'var(--noir)', borderRadius: '3px', padding: '0 2px' }}>
        {partie}
      </mark>
    ) : <span key={i}>{partie}</span>
  )
}

const SEUIL_EMPILEMENT = 8
const ELEMENTS_PAR_PAGE = 48

function CarteEmpilee({ groupe, onClick }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', cursor: 'pointer', paddingBottom: '10px' }}>
      <div style={{ position: 'absolute', top: '8px', left: '8px', right: '-8px', bottom: '2px', background: 'var(--rose-poudre)', borderRadius: 'var(--radius-lg)', opacity: 0.5, transform: 'rotate(2deg)' }} />
      <div style={{ position: 'absolute', top: '4px', left: '4px', right: '-4px', bottom: '6px', background: 'var(--blush)', borderRadius: 'var(--radius-lg)', opacity: 0.8, transform: 'rotate(-1.5deg)' }} />
      <div style={{ position: 'relative', background: 'var(--blanc)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <img src="/logo.jpg" alt="La Grande Mercerie" style={{ width: '64px', height: '64px', objectFit: 'contain', opacity: 0.85 }} />
          <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--rose-profond)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '50px' }}>
            {groupe.count} réf.
          </span>
        </div>
        <div style={{ padding: '1rem 1.25rem 1.25rem', flex: 1 }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rose-profond)', fontWeight: 700 }}>{groupe.categorie}</span>
          <h3 style={{ fontFamily: 'var(--font-titre)', fontSize: '1rem', color: 'var(--noir)', marginTop: '0.35rem', marginBottom: '0.5rem' }}>{groupe.nom}</h3>
          <p style={{ fontFamily: 'var(--font-titre)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--rose-profond)' }}>
            De {groupe.prixMin.toLocaleString('fr-FR')} à {groupe.prixMax.toLocaleString('fr-FR')} F CFP
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--gris-texte)', marginTop: '0.5rem' }}>Voir tous les modèles →</p>
        </div>
      </div>
    </div>
  )
}

function Pagination({ pageActive, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const maxVisible = 5
  let debut = Math.max(1, pageActive - Math.floor(maxVisible / 2))
  let fin = Math.min(totalPages, debut + maxVisible - 1)
  if (fin - debut < maxVisible - 1) debut = Math.max(1, fin - maxVisible + 1)
  const pages = []
  for (let i = debut; i <= fin; i++) pages.push(i)
  const boutonStyle = actif => ({
    minWidth: '2.2rem', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)',
    border: '1.5px solid', borderColor: actif ? 'var(--rose-profond)' : 'var(--rose-poudre)',
    background: actif ? 'var(--rose-profond)' : 'var(--blanc)',
    color: actif ? 'white' : 'var(--noir)', fontFamily: 'var(--font-corps)',
    fontWeight: actif ? 700 : 400, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s ease',
  })
  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
      <button onClick={() => onChange(pageActive - 1)} disabled={pageActive === 1}
        style={{ ...boutonStyle(false), opacity: pageActive === 1 ? 0.4 : 1, cursor: pageActive === 1 ? 'not-allowed' : 'pointer' }}>
        ← Précédent
      </button>
      {debut > 1 && (<><button onClick={() => onChange(1)} style={boutonStyle(false)}>1</button>{debut > 2 && <span style={{ color: 'var(--gris-texte)' }}>…</span>}</>)}
      {pages.map(p => <button key={p} onClick={() => onChange(p)} style={boutonStyle(p === pageActive)}>{p}</button>)}
      {fin < totalPages && (<>{fin < totalPages - 1 && <span style={{ color: 'var(--gris-texte)' }}>…</span>}<button onClick={() => onChange(totalPages)} style={boutonStyle(false)}>{totalPages}</button></>)}
      <button onClick={() => onChange(pageActive + 1)} disabled={pageActive === totalPages}
        style={{ ...boutonStyle(false), opacity: pageActive === totalPages ? 0.4 : 1, cursor: pageActive === totalPages ? 'not-allowed' : 'pointer' }}>
        Suivant →
      </button>
    </div>
  )
}

// Sidebar filtres
function Sidebar({ categories, marques, categorieActive, setCategorieActive, marqueActive, setMarqueActive, totalResultats }) {
  const [catOuverte, setCatOuverte] = useState(true)
  const [marqueOuverte, setMarqueOuverte] = useState(true)

  const itemStyle = (actif) => ({
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.3rem 0',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: actif ? 'var(--rose-profond)' : 'var(--gris-texte)',
    fontWeight: actif ? 600 : 400,
    transition: 'color 0.15s',
  })

  const radioStyle = (actif) => ({
    width: '14px', height: '14px', borderRadius: '50%',
    border: `2px solid ${actif ? 'var(--rose-profond)' : '#ccc'}`,
    background: actif ? 'var(--rose-profond)' : 'white',
    flexShrink: 0, transition: 'all 0.15s',
  })

  const titreSection = {
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--noir)',
    marginBottom: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  }

  return (
    <aside style={{
      width: '210px',
      flexShrink: 0,
      position: 'sticky',
      top: '1.5rem',
      alignSelf: 'flex-start',
      maxHeight: 'calc(100vh - 3rem)',
      overflowY: 'auto',
      paddingRight: '1rem',
      scrollbarWidth: 'thin',
    }}>

      {/* Résultats */}
      <p style={{ fontSize: '0.78rem', color: 'var(--gris-texte)', marginBottom: '1.5rem' }}>
        <strong style={{ color: 'var(--noir)' }}>{totalResultats}</strong> produit{totalResultats !== 1 ? 's' : ''}
      </p>

      

      {/* Marque */}
      {marques.length > 1 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={titreSection} onClick={() => setMarqueOuverte(o => !o)}>
            Marque <span style={{ fontSize: '0.9rem', color: 'var(--gris-texte)' }}>{marqueOuverte ? '−' : '+'}</span>
          </p>
          {marqueOuverte && (
            <div>
              {marques.map(mq => (
                <div key={mq} style={itemStyle(marqueActive === mq)}
                  onClick={() => setMarqueActive(marqueActive === mq && mq !== 'Toutes' ? 'Toutes' : mq)}>
                  <div style={radioStyle(marqueActive === mq)} />
                  {mq}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Famille */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--rose-poudre)', paddingBottom: '1.5rem' }}>
        <p style={titreSection} onClick={() => setCatOuverte(o => !o)}>
          Famille <span style={{ fontSize: '0.9rem', color: 'var(--gris-texte)' }}>{catOuverte ? '−' : '+'}</span>
        </p>
        {catOuverte && (
          <div>
            {categories.map(cat => (
              <div key={cat} style={itemStyle(categorieActive === cat)}
                onClick={() => setCategorieActive(categorieActive === cat && cat !== 'Tous' ? 'Tous' : cat)}>
                <div style={radioStyle(categorieActive === cat)} />
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Réinitialiser */}
      {(categorieActive !== 'Tous' || marqueActive !== 'Toutes') && (
        <button
          onClick={() => { setCategorieActive('Tous'); setMarqueActive('Toutes') }}
          style={{
            width: '100%', padding: '0.5rem',
            background: 'none', border: '1px solid var(--rose-poudre)',
            borderRadius: 'var(--radius)', cursor: 'pointer',
            fontSize: '0.78rem', color: 'var(--gris-texte)',
            fontFamily: 'var(--font-corps)',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose-profond)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rose-poudre)'}
        >
          Effacer les filtres
        </button>
      )}
    </aside>
  )
}

export default function Catalogue() {
  const { products, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [vueMode, setVueMode] = useState('grille')
  const [filtresMobile, setFiltresMobile] = useState(false)
  const [largeurEcran, setLargeurEcran] = useState(window.innerWidth)

  useEffect(() => {
    const onResize = () => setLargeurEcran(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isMobile = largeurEcran < 768

  const recherche       = searchParams.get('q') || ''
  const categorieActive = searchParams.get('cat') || 'Tous'
  const marqueActive    = searchParams.get('marque') || 'Toutes'
  const triPrix         = searchParams.get('tri') || 'popularite'

  const setRecherche = val => {
    const p = new URLSearchParams(searchParams)
    val ? p.set('q', val) : p.delete('q')
    setSearchParams(p, { replace: true })
  }

  const [rechercheInput, setRechercheInput] = useState(recherche)
  useEffect(() => { setRechercheInput(recherche) }, [recherche])
  useEffect(() => {
    const timer = setTimeout(() => { if (rechercheInput !== recherche) setRecherche(rechercheInput) }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rechercheInput])

  const setCategorieActive = val => {
    const p = new URLSearchParams(searchParams)
    val && val !== 'Tous' ? p.set('cat', val) : p.delete('cat')
    setSearchParams(p, { replace: true })
  }

  const setMarqueActive = val => {
    const p = new URLSearchParams(searchParams)
    val && val !== 'Toutes' ? p.set('marque', val) : p.delete('marque')
    setSearchParams(p, { replace: true })
  }

  const setTriPrix = val => {
    const p = new URLSearchParams(searchParams)
    val && val !== 'popularite' ? p.set('tri', val) : p.delete('tri')
    setSearchParams(p, { replace: true })
  }

  const pageActive = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const setPageActive = val => {
    const p = new URLSearchParams(searchParams)
    val && val > 1 ? p.set('page', String(val)) : p.delete('page')
    setSearchParams(p, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.categorie).filter(Boolean))]
    return ['Tous', ...cats.sort()]
  }, [products])

  const marques = useMemo(() => {
    const mqs = [...new Set(products.map(p => p.marque).filter(Boolean))]
    return ['Toutes', ...mqs.sort()]
  }, [products])

  const produitsFiltres = useMemo(() => {
    let liste = [...products]
    if (categorieActive !== 'Tous') liste = liste.filter(p => p.categorie === categorieActive)
    if (marqueActive !== 'Toutes') liste = liste.filter(p => p.marque === marqueActive)
    const termeRecherche = recherche.trim()
    if (termeRecherche) {
      if (termeRecherche.startsWith('=')) {
        const nomExact = termeRecherche.slice(1).trim().toLowerCase()
        liste = liste.filter(p => p.nom?.trim().toLowerCase() === nomExact)
      } else {
        const matchGuillemets = termeRecherche.match(/^"(.+)"$/)
        if (matchGuillemets) {
          const motExact = matchGuillemets[1].trim()
          if (motExact) {
            const regex = new RegExp(`\\b${echapperRegex(motExact)}\\b`, 'i')
            liste = liste.filter(p => regex.test(p.nom || '') || regex.test(p.description || ''))
          }
        } else {
          const mots = termeRecherche.toLowerCase().split(/\s+/).filter(Boolean)
          liste = liste.filter(p => {
            const texte = `${p.nom || ''} ${p.description || ''}`.toLowerCase()
            return mots.every(mot => texte.includes(mot))
          })
        }
      }
    }
    if (triPrix === 'asc')        liste.sort((a, b) => a.prix - b.prix)
    if (triPrix === 'desc')       liste.sort((a, b) => b.prix - a.prix)
    if (triPrix === 'popularite') liste.sort((a, b) => (a.popularite || 99999) - (b.popularite || 99999))
    return liste
  }, [products, categorieActive, marqueActive, recherche, triPrix])

  const elementsAffiches = useMemo(() => {
    if (recherche.trim()) {
      return produitsFiltres.map(p => ({ type: 'produit', data: p, nom: p.nom || '' }))
    }
    const parNom = {}
    produitsFiltres.forEach(p => {
      const nomKey = p.nom?.trim().toLowerCase()
      if (!nomKey) return
      parNom[nomKey] = parNom[nomKey] || []
      parNom[nomKey].push(p)
    })
    const refsAEmpiler = new Set()
    const elements = []
    Object.entries(parNom).forEach(([nomKey, items]) => {
      if (items.length >= SEUIL_EMPILEMENT) {
        items.forEach(p => refsAEmpiler.add(p.id))
        const prix = items.map(p => p.prix)
        elements.push({
          type: 'groupe', nom: items[0].nom || '',
          data: { nom: items[0].nom, categorie: items[0].categorie, count: items.length, prixMin: Math.min(...prix), prixMax: Math.max(...prix) },
        })
      }
    })
    produitsFiltres.filter(p => !refsAEmpiler.has(p.id)).forEach(p => elements.push({ type: 'produit', data: p, nom: p.nom || '' }))
    if (triPrix === 'default') {
      elements.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    } else if (triPrix === 'popularite') {
      elements.sort((a, b) => (a.data.popularite || 99999) - (b.data.popularite || 99999))
    }
    return elements
  }, [produitsFiltres, recherche, triPrix])

  const totalResultats = elementsAffiches.reduce((sum, el) => sum + (el.type === 'groupe' ? el.data.count : 1), 0)
  const totalPages = Math.max(1, Math.ceil(elementsAffiches.length / ELEMENTS_PAR_PAGE))

  useEffect(() => { setPageActive(1) }, [categorieActive, marqueActive, recherche, triPrix]) // eslint-disable-line
  useEffect(() => { if (pageActive > totalPages) setPageActive(1) }, [totalPages]) // eslint-disable-line

  const elementsPage = useMemo(() => {
    const debut = (pageActive - 1) * ELEMENTS_PAR_PAGE
    return elementsAffiches.slice(debut, debut + ELEMENTS_PAR_PAGE)
  }, [elementsAffiches, pageActive])

  return (
    <main className="page" style={{ paddingBottom: '5rem' }}>
      <div className="container">

        {/* Titre */}
        <div className="section-titre" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-titre)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Notre Catalogue</h1>
          <p>Tous nos produits pour vos créations</p>
          <span className="trait" />
        </div>

        {/* Barre recherche + tri */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>

          {/* Bouton filtres mobile */}
          {isMobile && (
            <button
              onClick={() => setFiltresMobile(o => !o)}
              style={{
                padding: '0.6rem 1rem', borderRadius: '50px',
                border: '1.5px solid var(--rose-poudre)', background: 'var(--blanc)',
                fontFamily: 'var(--font-corps)', fontSize: '0.85rem',
                cursor: 'pointer', color: 'var(--noir)', display: 'flex', gap: '0.4rem', alignItems: 'center',
              }}
            >
              ⚙ Filtres {(categorieActive !== 'Tous' || marqueActive !== 'Toutes') && '·'}
            </button>
          )}

          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={rechercheInput}
              onChange={e => setRechercheInput(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 2.2rem 0.65rem 1rem',
                border: '1.5px solid var(--rose-poudre)', borderRadius: '50px',
                fontFamily: 'var(--font-corps)', fontSize: '0.88rem',
                background: 'var(--blanc)', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--rose-profond)'}
              onBlur={e => e.target.style.borderColor = 'var(--rose-poudre)'}
            />
            {rechercheInput && (
              <button onClick={() => { setRechercheInput(''); setRecherche('') }}
                style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gris-texte)', fontSize: '0.9rem', padding: '0.2rem' }}>
                ✕
              </button>
            )}
          </div>

          <select value={triPrix} onChange={e => setTriPrix(e.target.value)}
            style={{ padding: '0.65rem 1rem', border: '1.5px solid var(--rose-poudre)', borderRadius: '50px', fontFamily: 'var(--font-corps)', fontSize: '0.85rem', background: 'var(--blanc)', cursor: 'pointer', outline: 'none', color: 'var(--noir)' }}>
            <option value="popularite">Popularité</option>
            <option value="default">Alphabétique</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>

          {/* Toggle vue */}
          <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto' }}>
            {['grille', 'liste'].map(mode => (
              <button key={mode} onClick={() => setVueMode(mode)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--rose-poudre)', background: vueMode === mode ? 'var(--rose-profond)' : 'var(--blanc)', color: vueMode === mode ? 'white' : 'var(--noir)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {mode === 'grille'
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                }
              </button>
            ))}
          </div>
        </div>

        {/* Filtres mobile (drawer) */}
        {isMobile && filtresMobile && (
          <div style={{ background: 'var(--blanc)', border: '1px solid var(--rose-poudre)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <Sidebar
              categories={categories} marques={marques}
              categorieActive={categorieActive} setCategorieActive={val => { setCategorieActive(val); setFiltresMobile(false) }}
              marqueActive={marqueActive} setMarqueActive={val => { setMarqueActive(val); setFiltresMobile(false) }}
              totalResultats={totalResultats}
            />
          </div>
        )}

        {/* Layout desktop : sidebar + grille */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

          {/* Sidebar desktop */}
          {!isMobile && (
            <Sidebar
              categories={categories} marques={marques}
              categorieActive={categorieActive} setCategorieActive={setCategorieActive}
              marqueActive={marqueActive} setMarqueActive={setMarqueActive}
              totalResultats={totalResultats}
            />
          )}

          {/* Zone produits */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {loading && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gris-texte)' }}>
                <img src="/logo.jpg" alt="" style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '1rem', opacity: 0.5 }} />
                <p>Chargement du catalogue...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--blanc)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--rose-poudre)' }}>
                <p style={{ color: 'var(--rose-profond)', fontWeight: 700, marginBottom: '0.5rem' }}>⚠️ Catalogue non chargé</p>
                <p style={{ color: 'var(--gris-texte)', fontSize: '0.9rem' }}>Le fichier <code>public/products.csv</code> est introuvable.</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {totalPages > 1 && (
                  <p style={{ color: 'var(--gris-texte)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                    Page {pageActive}/{totalPages}
                  </p>
                )}

                {totalResultats === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--blanc)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--gris-texte)' }}>Aucun produit ne correspond à votre recherche.</p>
                  </div>
                ) : vueMode === 'grille' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.25rem' }}>
                    {elementsPage.map(el =>
                      el.type === 'groupe'
                        ? <CarteEmpilee key={el.nom} groupe={el.data} onClick={() => setRecherche(`=${el.nom}`)} />
                        : <ProductCard key={el.data.id} product={el.data} />
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {elementsPage.filter(el => el.type === 'produit').map(el => {
                      const p = el.data
                      return (
                        <Link key={p.id} to={`/produit/${p.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--blanc)', borderRadius: 'var(--radius)', padding: '0.65rem 1rem', boxShadow: 'var(--shadow-card)', transition: 'transform 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                            <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius)', background: 'var(--blush)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {p.image
                                ? <img src={`/images/products/${p.image}`} alt={p.nom} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                                : <img src="/logo.jpg" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', opacity: 0.6 }} />
                              }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--rose-profond)', fontWeight: 600 }}>{p.categorie}</span>
                              <p style={{ fontFamily: 'var(--font-titre)', fontSize: '0.92rem', color: 'var(--noir)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {recherche.trim() ? surlignerTexte(p.nom, recherche) : p.nom}
                              </p>
                              {p.marque && <span style={{ fontSize: '0.7rem', color: 'var(--gris-texte)' }}>{p.marque}</span>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <p style={{ fontFamily: 'var(--font-titre)', fontWeight: 700, color: 'var(--rose-profond)', fontSize: '0.95rem' }}>
                                {p.prix.toLocaleString('fr-FR')} F CFP
                              </p>
                              {p.stock <= 5 && p.stock > 0 && (
                                <span style={{ fontSize: '0.68rem', color: '#e07b39', fontWeight: 600 }}>
                                  Plus que {p.stock} en stock
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}

                <Pagination pageActive={pageActive} totalPages={totalPages} onChange={setPageActive} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Retour en haut */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--rose-profond)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(200,107,138,0.4)', transition: 'transform 0.2s', zIndex: 50 }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        title="Retour en haut">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </main>
  )
}