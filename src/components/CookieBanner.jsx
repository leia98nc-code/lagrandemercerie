import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('lgm_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('lgm_cookie_consent', 'accepted')
    setVisible(false)
  }

  const refuse = () => {
    localStorage.setItem('lgm_cookie_consent', 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      maxWidth: '520px',
      background: 'var(--blanc)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 8px 40px rgba(26,26,26,0.18)',
      padding: '1.5rem',
      zIndex: 999,
      borderLeft: '4px solid var(--rose-profond)',
      animation: 'fadeInUp 0.4s ease',
    }}>
      <p style={{
        fontFamily: 'var(--font-titre)',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--rose-profond)',
        marginBottom: '0.5rem',
      }}>
        🍪 Cookies & confidentialité
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--gris-texte)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        Ce site utilise uniquement des cookies essentiels au bon fonctionnement.
        Aucune donnée n'est transmise à des tiers à des fins publicitaires.{' '}
        <Link to="/mentions-legales" style={{ color: 'var(--rose-profond)' }}>
          En savoir plus
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={accept} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}>
          Accepter
        </button>
        <button onClick={refuse} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}>
          Refuser
        </button>
      </div>
    </div>
  )
}
