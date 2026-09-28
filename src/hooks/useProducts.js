import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    fetch('/products.csv')
      .then(res => {
        if (!res.ok) throw new Error('Fichier CSV introuvable')
        return res.text()
      })
      .then(csv => {
        const result = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          transform: v => v.trim(),
        })

        // Comparaison de dates en texte "YYYY-MM-DD" : ça fonctionne car ce
        // format se compare correctement caractère par caractère, sans avoir
        // besoin de construire de vrais objets Date.
        // Date locale du visiteur (pas UTC : Nouméa a 11h d'avance sur UTC)
                const d = new Date()
        const aujourdHui = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const data = result.data.map(p => {
          
          // Parser stocks_gammes en objet { "ANIS - 65": 23, ... }
          const stocks_gammes = {}
          if (p.stocks_gammes) {
            p.stocks_gammes.split('|').forEach(item => {
              const idx = item.lastIndexOf(':')
              if (idx !== -1) {
                const gamme = item.substring(0, idx).trim()
                const stock = parseInt(item.substring(idx + 1)) || 0
                stocks_gammes[gamme] = stock
              }
            })
          }

                    const prixPromo = parseFloat(p.prix_promo) || null
          const promoFin = p.promo_fin || null

          return {
  ...p,
  prix:              parseFloat(p.prix) || 0,
  stock:             parseInt(p.stock) || 0,
  dispo:             p.dispo?.toLowerCase() === 'true' || p.dispo === '1',
  nouveau:           p.nouveau?.toLowerCase() === 'true',
  popularite:        parseInt(p.popularite) || 99999,
  prix_promo:        prixPromo,
  promo_type:        p.promo_type || null,
  promo_valeur:      p.promo_valeur ? parseFloat(p.promo_valeur) : null,
  promo_debut:       p.promo_debut || null,
  promo_fin:         promoFin,
  // true seulement si une promo existe, qu'elle a démarré (pas de date de
  // début = déjà démarrée) et que sa date de fin n'est pas dépassée (pas de
  // date de fin = sans limite). La promo disparaît ainsi pile à minuit,
  // sans attendre le prochain passage du pipeline.
  enPromo:           !!(prixPromo
                        && (!p.promo_debut || p.promo_debut <= aujourdHui)
                        && (!promoFin || promoFin >= aujourdHui)),
  stocks_gammes,
}
        })
        setProducts(data)
      })
      .catch(err => { console.error('Erreur useProducts :', err); setError(err.message) })
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}