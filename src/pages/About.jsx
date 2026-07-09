import { Link } from 'react-router-dom'
import { useState } from 'react'

const PHOTOS = [
  { src: '/images/shop/shop1.jpg', alt: 'Entrée de la boutique' },
  { src: '/images/shop/shop2.jpg', alt: 'Fond gauche de la boutique' },
  { src: '/images/shop/shop3.jpg', alt: 'Intérieur de la boutique' },
  { src: '/images/shop/shop4.jpg', alt: 'Rayon pelotes' },
]

export default function About() {
  const [photoIndex, setPhotoIndex] = useState(0)

  const precedent = () => setPhotoIndex(i => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const suivant   = () => setPhotoIndex(i => (i + 1) % PHOTOS.length)

  return (
    <main className="page" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        {/* Titre */}
        <div className="section-titre" style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-titre)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Notre histoire
          </h1>
          <span className="trait" />
        </div>

        {/* Carrousel photos */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>

          {/* Image */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(200,107,138,0.2)',
            aspectRatio: '16/9',
            background: 'var(--blush)',
          }}>
            <img
              src={PHOTOS[photoIndex].src}
              alt={PHOTOS[photoIndex].alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }}
            />
          </div>

          {/* Flèche gauche */}
          <button
            onClick={precedent}
            style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              cursor: 'pointer', fontSize: '1.4rem', color: 'var(--rose-profond)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'white'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >
            ‹
          </button>

          {/* Flèche droite */}
          <button
            onClick={suivant}
            style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              cursor: 'pointer', fontSize: '1.4rem', color: 'var(--rose-profond)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'white'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >
            ›
          </button>

          {/* Indicateur X / total */}
          <div style={{
            position: 'absolute', bottom: '1rem', right: '1rem',
            background: 'rgba(0,0,0,0.45)', color: 'white',
            borderRadius: '50px', padding: '0.25rem 0.75rem',
            fontSize: '0.8rem', fontFamily: 'var(--font-corps)',
          }}>
            {photoIndex + 1} / {PHOTOS.length}
          </div>

          {/* Points indicateurs */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '0.5rem',
            marginTop: '1rem',
          }}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                style={{
                  width: photoIndex === i ? '24px' : '8px',
                  height: '8px', borderRadius: '50px',
                  background: photoIndex === i ? 'var(--rose-profond)' : 'var(--rose-poudre)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease', padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bloc intro */}
        <div style={{
          background: 'var(--blanc)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '2.5rem',
          borderLeft: '4px solid var(--rose-profond)',
        }}>
          <p style={{
            fontFamily: 'var(--font-titre)',
            fontSize: '1.3rem',
            fontStyle: 'italic',
            color: 'var(--rose-profond)',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
          }}>
            « Chez La Grande Mercerie, chaque fil raconte une histoire, chaque tissu porte une promesse. »
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--gris-texte)', fontWeight: 300 }}>
            Depuis plus de 50 ans, La Grande Mercerie vous accompagne dans tous vos projets de création.
            Une boutique qui a su se renouveler au fil du temps, tout en restant fidèle à l'essentiel :
            des produits de qualité, des nouveautés dans la tendance, et des conseils sincères pour
            chacune de vos envies. Notre équipe de passionnées met tout son cœur à concilier prix juste
            et belle qualité, toujours avec bonne humeur et le sourire.
          </p>
        </div>

        {/* Valeurs */}
        <h2 style={{
          fontFamily: 'var(--font-titre)',
          fontSize: '1.6rem',
          color: 'var(--noir)',
          marginBottom: '1.5rem',
        }}>
          Nos valeurs
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}>
          {[
            { icon: '🧵', titre: 'Grand choix',          texte: 'Plus de 4 000 références en boutique : fils, laines, tissus, boutons et accessoires pour tous vos projets.' },
            { icon: '💌', titre: 'Conseil personnalisé',  texte: 'Notre équipe passionnée est là pour vous guider dans vos projets, quel que soit votre niveau.' },
            { icon: '✨', titre: 'Grandes marques',      texte: 'DMC, Cheval Blanc, Bohin, Katia... nous sélectionnons des marques reconnues pour leur qualité.' },
          ].map(({ icon, titre, texte }) => (
            <div key={titre} style={{
              background: 'var(--blush)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-titre)',
                color: 'var(--rose-profond)',
                marginBottom: '0.5rem',
                fontSize: '1rem',
              }}>{titre}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gris-texte)', lineHeight: 1.6 }}>{texte}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/catalogue" className="btn-primary" style={{ marginRight: '1rem' }}>
            Découvrir le catalogue
          </Link>
          <Link to="/contact" className="btn-outline">Nous contacter</Link>
        </div>

      </div>
    </main>
  )
}