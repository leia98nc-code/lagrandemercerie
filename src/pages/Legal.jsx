import { useSEO } from '../hooks/useSEO'
export default function Legal() {
  useSEO({
    titre: 'Mentions légales et confidentialité',
    description: 'Mentions légales, protection des données personnelles et cookies du site de La Grande Mercerie, Nouméa.',
    chemin: '/mentions-legales',
  })
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
            contenu: `Ce site est hébergé par : Netlify, Inc. Netlify assure également la réception des messages envoyés via le formulaire de contact.

Les noms de domaine, la sécurité du trafic web et la mesure d'audience anonyme sont gérés par :
Cloudflare, Inc. Cloudflare peut traiter les adresses IP des visiteurs dans le cadre de la protection contre les attaques et de la gestion du trafic. Consultez leur politique de confidentialité sur cloudflare.com/privacypolicy.

Les polices de caractères du site sont fournies par Google Fonts (Google LLC). Leur chargement implique la transmission de votre adresse IP aux serveurs de Google, uniquement pour afficher correctement les textes du site.`,
          },
          {
            titre: '3. Données personnelles',
            contenu: `La Grande Mercerie collecte les données personnelles suivantes :

- Formulaire de contact : nom, adresse e-mail, message. Ces données sont utilisées uniquement pour répondre à votre demande et ne sont jamais transmises à des tiers ni utilisées à des fins commerciales.

- Newsletter : si vous vous inscrivez à notre newsletter, votre adresse e-mail est collectée dans le seul but de vous informer des actualités et nouveautés de la boutique. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque e-mail.

Bien que le Règlement général sur la protection des données (RGPD) européen ne s'applique pas directement en Nouvelle-Calédonie, La Grande Mercerie s'engage à en respecter les principes fondamentaux : collecte limitée au strict nécessaire, finalité explicite, durée de conservation limitée et sécurisation des données.

Pour toute demande relative à vos données (accès, rectification, suppression) :
lagrandemercerie.nc@gmail.com`,
          },
          {
            titre: '4. Cookies',
            contenu: `Ce site utilise un nombre très limité de cookies :

- Cookie de consentement : mémorise votre choix concernant l'acceptation des cookies. Aucune donnée personnelle n'est transmise.

- Cookies tiers : le widget Facebook intégré en page d'accueil peut déposer des cookies issus de Meta si vous avez accepté leur utilisation. Ces cookies sont indépendants de notre contrôle.

Aucun cookie publicitaire, de tracking ou d'analyse d'audience n'est déposé par La Grande Mercerie. La mesure de fréquentation du site est réalisée sans cookie (voir section 5).

Vous pouvez à tout moment modifier vos préférences via la bannière de consentement affichée lors de votre première visite, ou en effaçant les données de votre navigateur.`,
          },
          {
            titre: "5. Mesure d'audience",
            contenu: `Pour comprendre comment le site est utilisé et l'améliorer, La Grande Mercerie utilise Cloudflare Web Analytics, un outil de mesure d'audience respectueux de la vie privée.

Cet outil ne dépose aucun cookie sur votre appareil et ne collecte aucune donnée permettant de vous identifier. Il ne suit pas votre navigation d'un site à l'autre et ne crée aucun profil.

Seules des statistiques globales et anonymes sont produites : nombre de visites, pages consultées, site de provenance, pays, type d'appareil et de navigateur. Elles servent uniquement au suivi de la fréquentation du site.

Aucun cookie ni identifiant n'étant utilisé, cette mesure ne nécessite pas votre consentement.`,
          },
          {
            titre: '6. Propriété intellectuelle',
            contenu: `L'ensemble du contenu de ce site (textes, images, logos, structure, descriptions produits) est la propriété exclusive de La Grande Mercerie ou de ses fournisseurs et marques partenaires.

Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.

Les marques et visuels des produits présentés (DMC, Katia, Cheval Blanc, Bohin, Prym, Hoooked...) sont la propriété de leurs détenteurs respectifs.`,
          },
          {
            titre: '7. Limitation de responsabilité',
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
          Dernière mise à jour : 12 octobre 2026
        </p>
      </div>
    </main>
  )
}