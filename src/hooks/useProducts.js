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
        const aujourdHui = new Date().toISOString().slice(0, 10)

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
  promo_pourcentage: p.promo_pourcentage ? parseFloat(p.promo_pourcentage) : null,
  promo_fin:         promoFin,
  // true seulement si une promo existe ET que sa date de fin n'est pas
  // dépassée aujourd'hui — c'est ce qui fait disparaître la promo pile à
  // minuit, sans attendre le prochain passage du pipeline.
  enPromo:           !!(prixPromo && promoFin && promoFin >= aujourdHui),
  stocks_gammes,
}
        })
        setProducts(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}