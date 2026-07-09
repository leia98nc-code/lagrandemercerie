export default function Legal() {
  return (
    <main className="page" style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>

        <div className="section-titre" style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-titre)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Mentions légales & RGPD
          </h1>
          <span className="trait" />
        </div>

        {[
          {
            titre: '1. Éditeur du site',
            contenu: `La Grande Mercerie
Forme juridique : [À compléter]
Adresse : 12 rue de la Couture, 75000 Paris
Email : contact@lagrandemercerie.fr
Téléphone : 01 23 45 67 89
Responsable de publication : [Nom du responsable]`,
          },
          {
            titre: '2. Hébergement',
            contenu: `Ce site est hébergé par Netlify, Inc.
44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis.
Les données sont traitées conformément aux réglementations européennes (RGPD).`,
          },
          {
            titre: '3. Propriété intellectuelle',
            contenu: `L'ensemble du contenu de ce site (textes, images, logos, structure) est la propriété exclusive de La Grande Mercerie, protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.`,
          },
          {
            titre: '4. Données personnelles (RGPD)',
            contenu: `Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679), vous disposez des droits suivants sur vos données :

• Droit d'accès à vos données personnelles
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition au traitement

Pour exercer ces droits : contact@lagrandemercerie.fr

Les données collectées via le formulaire de contact (nom, email, message) sont utilisées uniquement pour répondre à vos demandes et ne sont jamais transmises à des tiers.`,
          },
          {
            titre: '5. Cookies',
            contenu: `Ce site utilise uniquement des cookies essentiels au bon fonctionnement (mémorisation de votre consentement). Aucun cookie publicitaire ou de tracking n'est déposé.

Vous pouvez à tout moment modifier vos préférences via la bannière de consentement ou en effaçant les données locales de votre navigateur.`,
          },
          {
            titre: '6. Responsabilité',
            contenu: `La Grande Mercerie s'efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur ce site.`,
          },
        ].map(({ titre, contenu }) => (
          <section key={titre} style={{
            background: 'var(--blanc)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 2rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '1.25rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-titre)',
              fontSize: '1.1rem',
              color: 'var(--rose-profond)',
              marginBottom: '0.75rem',
            }}>
              {titre}
            </h2>
            <p style={{
              fontSize: '0.88rem',
              lineHeight: 1.8,
              color: 'var(--gris-texte)',
              whiteSpace: 'pre-line',
            }}>
              {contenu}
            </p>
          </section>
        ))}

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#aaa', marginTop: '1.5rem' }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </main>
  )
}
