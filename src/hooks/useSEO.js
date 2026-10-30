import { useEffect } from 'react'

// Adresse officielle du site (même valeur que SITE_URL dans pipeline_quotidien.py)
const SITE_URL = 'https://www.lagrandemercerie.nc'

const TITRE_PAR_DEFAUT = 'La Grande Mercerie — Mercerie à Nouméa'
const DESCRIPTION_PAR_DEFAUT =
  'La Grande Mercerie, boutique de mercerie à Nouméa : laines et pelotes, fils, tissus, boutons et accessoires de couture, tricot, crochet et broderie.'

// Remplace (ou crée) une balise <meta name="..."> dans le <head>
function definirMeta(nom, contenu) {
  let balise = document.querySelector(`meta[name="${nom}"]`)
  if (!balise) {
    balise = document.createElement('meta')
    balise.setAttribute('name', nom)
    document.head.appendChild(balise)
  }
  balise.setAttribute('content', contenu)
}

// Remplace (ou crée) la balise <link rel="canonical"> : elle indique à Google
// l'adresse "officielle" de la page, pour éviter les doublons
// (ex. /catalogue?page=3&promo=1 doit compter comme /catalogue).
function definirCanonique(url) {
  let balise = document.querySelector('link[rel="canonical"]')
  if (!balise) {
    balise = document.createElement('link')
    balise.setAttribute('rel', 'canonical')
    document.head.appendChild(balise)
  }
  balise.setAttribute('href', url)
}

// Coupe un texte trop long proprement (Google affiche ~155 caractères)
export function raccourcir(texte, max = 155) {
  const propre = String(texte || '').replace(/\s+/g, ' ').trim()
  if (propre.length <= max) return propre
  return propre.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

/**
 * Donne à la page son propre titre (onglet + résultat Google), sa description
 * et son adresse officielle.
 *   titre       : texte du titre, sans le nom de la boutique (ajouté automatiquement)
 *   description : 1 à 2 phrases résumant la page
 *   chemin      : chemin de la page, ex. '/catalogue'
 *   indexer     : false pour demander à Google de ne pas référencer la page
 */
export function useSEO({ titre, description, chemin, indexer = true }) {
  useEffect(() => {
    document.title = titre ? `${titre} | La Grande Mercerie Nouméa` : TITRE_PAR_DEFAUT
    definirMeta('description', description || DESCRIPTION_PAR_DEFAUT)
    definirMeta('robots', indexer ? 'index, follow' : 'noindex')
    if (chemin) definirCanonique(SITE_URL + chemin)
  }, [titre, description, chemin, indexer])
}
