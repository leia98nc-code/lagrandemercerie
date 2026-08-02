import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { id, nom, categorie, prix, description, dispo, image, marque } = product

  return (
    <Link to={`/produit/${id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--blanc)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(200,107,138,0.18)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        }}
      >
        {/* Image */}
        <div style={{
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'var(--blanc)',
  overflow: 'hidden',
  position: 'relative',
  backgroundImage: 'url(/logo.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: '30%',
}}>
          {image && (
            <img
              src={`/images/products/${image}`}
              alt=""
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '84%',
                height: '84%',
                objectFit: 'contain',
                objectPosition: 'center',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={e => e.target.style.transform = 'translate(-50%, -50%) scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'translate(-50%, -50%)'}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}

          {/* Badge dispo */}
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: dispo ? 'var(--rose-profond)' : '#999',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: '50px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {dispo ? 'En stock' : 'Indispo'}
          </span>
        </div>

        {/* Infos */}
<div style={{ padding: '0.75rem 1rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
  
  <span style={{
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--rose-profond)',
    fontWeight: 600,
    marginBottom: '0.3rem',
  }}>
    {categorie}
  </span>

  <h3 style={{
    fontFamily: 'var(--font-corps)',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--noir)',
    marginBottom: '0.25rem',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.4,
  }}>
    {nom}
  </h3>

  {product?.marque && (
    <span style={{
      fontSize: '0.7rem',
      color: 'var(--gris-texte)',
      marginBottom: '0.5rem',
    }}>
      {product.marque}
    </span>
  )}

  

  <div style={{
    fontFamily: 'var(--font-titre)',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--rose-prix)',
    textAlign: 'right',
    marginTop: 'auto',
  }}>
    {prix > 0 ? `${prix.toLocaleString('fr-FR')} F` : 'Prix sur demande'}
  </div>

</div>
      </div>
    </Link>
  )
}