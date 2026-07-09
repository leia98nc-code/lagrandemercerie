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

          return {
  ...p,
  prix:          parseFloat(p.prix) || 0,
  stock:         parseInt(p.stock) || 0,
  dispo:         p.dispo?.toLowerCase() === 'true' || p.dispo === '1',
  popularite:    parseInt(p.popularite) || 99999,
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