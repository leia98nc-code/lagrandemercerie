export default function Legal() {
  return (
    <main className="page" style={{ padding: '3rem 0 5rem', background: 'var(--blush)', paddingTop: '6rem' }}>

      <div className="container" style={{ maxWidth: '780px' }}>

        <div className="section-titre" style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-titre)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Mentions légales & Confidentialité
          </h1>
          <span className="trait" />
        </div>

        {[
          {
  titre: '1. Éditeur du site',
  contenu: `Dénomination : La Grande Mercerie
Adresse : 16 Route de l'Anse Vata, Nouméa, Nouvelle-Calédonie
Email : lagrandemercerie.nc@gmail.com
Responsable de publication : Astrid RAGOT

Ce site est un catalogue en ligne à titre informatif. Aucune transaction commerciale n'est réalisée directement sur ce site.

Conception et développement : ZENKAI — Création & Conseil Web, Nouméa, Nouvelle-Calédonie`,
},
          {
            titre: '2. Hébergement & infrastructure',
            contenu: `Ce site est hébergé par : Netlify, Inc.

Les noms de domaine et la sécurité du trafic web sont gérés par :
Cloudflare, Inc. Cloudflare peut traiter les adresses IP des visiteurs dans le cadre de la protection contre les attaques et de la gestion du trafic. Consultez leur politique de confidentialité sur cloudflare.com/privacypolicy.`,
          },
          {
          
            titre: '3. Données personnelles',
            contenu: `La Grande Mercerie collecte les données personnelles suivantes :

- Formulaire de contact : nom, adresse e-mail, message. Ces données sont utilisées uniquement pour répondre à votre demande et ne sont jamais transmises à des tiers ni utilisées à des fins commerciales.

- Newsletter : si vous vous inscrivez à notre newsletter, votre adresse e-mail est collectée dans le seul but de vous informer des actualités et nouveautés de la boutique. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque e-mail.

Pour toute demande relative à vos données (accès, rectification, suppression) :
contact@lagrandemercerie.nc`,
          },
          {
            titre: '4. Cookies',
            contenu: `Ce site utilise un nombre très limité de cookies :

- Cookie de consentement : mémorise votre choix concernant l'acceptation des cookies. Aucune donnée personnelle n'est transmise.

- Cookies tiers : le widget Facebook intégré en page d'accueil peut déposer des cookies issus de Meta si vous avez accepté leur utilisation. Ces cookies sont indépendants de notre contrôle.

Aucun cookie publicitaire, de tracking ou d'analyse d'audience n'est déposé par La Grande Mercerie.

Vous pouvez à tout moment modifier vos préférences via la bannière de consentement affichée lors de votre première visite, ou en effaçant les données de votre navigateur.`,
          },
          {
            titre: '5. Propriété intellectuelle',
            contenu: `L'ensemble du contenu de ce site (textes, images, logos, structure, descriptions produits) est la propriété exclusive de La Grande Mercerie ou de ses fournisseurs et marques partenaires.

Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.

Les marques et visuels des produits présentés (DMC, Katia, Cheval Blanc, Bohin, Prym, Hoooked...) sont la propriété de leurs détenteurs respectifs.`,
          },
          {
            titre: '6. Limitation de responsabilité',
            contenu: `Les informations présentées sur ce site (prix, stocks, descriptions) sont issues du logiciel de gestion de la boutique et mises à jour régulièrement. Elles sont fournies à titre indicatif et peuvent différer des disponibilités réelles en boutique.

La Grande Mercerie ne saurait être tenue responsable d'éventuelles erreurs, omissions ou indisponibilités temporaires du site.`,
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
}export default function Legal() {
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
