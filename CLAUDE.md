# CLAUDE.md — La Grande Mercerie

Ce fichier donne à Claude Code tout le contexte nécessaire pour reprendre le développement du site **La Grande Mercerie** sans avoir à tout réexpliquer. Il reprend l'historique des échanges menés sur claude.ai (chat web) avant la bascule vers Claude Code.

---

## 1. Qui est le projet, qui est Baptiste

- **Client / porteur du projet** : Baptiste ZENKAI, développeur web novice, basé à Nouméa, Nouvelle-Calédonie.
- **Le site** : catalogue produits en ligne pour **La Grande Mercerie**, une boutique de mercerie (fils, tissus, boutons, accessoires couture) à Nouméa.
- **Objectif final** : un catalogue alimenté **automatiquement** depuis le logiciel de gestion Sage 100 de la boutique, sans ressaisie manuelle.
- **Niveau technique de Baptiste** : novice. Il a besoin d'explications vulgarisées, pas de jargon balancé sans contexte. Voir section 8 "Comment travailler avec Baptiste" — c'est la partie la plus importante de ce fichier.

---

## 2. Stack technique

| Brique | Choix |
|---|---|
| Frontend | React + Vite |
| Routing | React Router |
| Parsing CSV côté client | papaparse |
| Hébergement | Netlify (plan gratuit), build automatique à chaque `git push` |
| Dépôt de code | GitHub, repo `la-grande-mercerie` (compte Baptiste ZENKAI) |
| DNS | Cloudflare — domaine `zenkai.nc`, **un seul A record** `75.2.60.5` sur l'apex (voir section 7, piège Let's Encrypt) |
| Base de données source | SQL Server 2017, instance `DESKTOP-EIOV9CB\SAGE100`, base `GRANDE_MERCERIE`, dépôt `DE_No = 1` |
| Génération du catalogue | Script Python (`generer_catalogue.py`) : lit `export_sage_site.ods` + scanne le dossier d'images → génère `public/products.csv` |
| Éditeur | VS Code (extension **GitDoc** suggérée pour l'auto-commit, voir section 7) |

### Cycle de déploiement actuel
```
SSMS (requête SQL) → export_sage_site.ods
        ↓
python generer_catalogue.py  (lit l'ODS + scanne les images → products.csv)
        ↓
copier products.csv dans public/
        ↓
git add . && git commit -m "..." && git push
        ↓
Netlify rebuild automatique → site en ligne
```

Objectif en cours : remplacer l'étape ODS manuelle par une connexion Python directe à Sage via `pyodbc`, avec push Git automatisé en tâche planifiée Windows quotidienne (voir section 6, chantier en cours — pas encore finalisé).

---

## 3. Structure du dépôt

```
la-grande-mercerie/
├── public/
│   ├── products.csv              ← SOURCE DE DONNÉES UNIQUE du site
│   ├── favicon.svg
│   ├── logo.jpg
│   └── images/
│       ├── shop/                 ← photos boutique (hero, etc.)
│       └── products/             ← photos produits, nommées {ref}.jpg ou {ref}_{suffixe_gamme}.jpg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── CookieBanner.jsx
│   ├── pages/
│   │   ├── Home.jsx              ← hero, coups de cœur, iframe Facebook, valeurs, newsletter
│   │   ├── Catalogue.jsx         ← filtres, recherche, tri, pagination
│   │   ├── ProductDetail.jsx     ← gammes cliquables, zoom loupe, stock par gamme
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Legal.jsx             ← mentions légales, RGPD, cookies
│   ├── hooks/
│   │   └── useProducts.js        ← charge products.csv, parse stocks_gammes
│   ├── App.jsx                   ← contient ScrollToTop
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml                  ← redirection SPA (`/*` → `/index.html`, status 200)
```

### Format `products.csv`
```
id, nom, categorie, prix, description, marque, gammes, stocks_gammes, stock, dispo, image
```

### Format `stocks_gammes`
```
gamme:stock|gamme:stock
```
Exemple : `FLANELLE:16|HORIZON:10` — les gammes à stock 0 sont exclues en amont par le pipeline Python.

> **Note** : le champ `dispo` est toujours `true` car le pipeline Python filtre déjà `stock > 0` avant génération du CSV. Ne pas l'exposer comme filtre utilisateur, c'est redondant.

---

## 4. Requête SQL catalogue (validée, ne pas modifier sans revalider avec Baptiste)

```sql
SELECT AR.AR_Ref, RTRIM(AR.AR_Design) AS designation, AR.FA_CodeFamille, AR.AR_PrixVen, ST.AS_QteSto,
STRING_AGG(CAST(AG.EG_Enumere AS NVARCHAR(MAX)), ' | ') WITHIN GROUP (ORDER BY AG.AG_No) AS gammes,
STRING_AGG(CAST(CAST(GS.GS_QteSto AS INT) AS NVARCHAR(MAX)), ' | ') WITHIN GROUP (ORDER BY AG.AG_No) AS stocks_gammes
FROM F_ARTICLE AR
LEFT JOIN F_ARTSTOCK ST ON AR.AR_Ref = ST.AR_Ref AND ST.DE_No = 1
LEFT JOIN F_ARTGAMME AG ON AR.AR_Ref = AG.AR_Ref
LEFT JOIN F_GAMSTOCK GS ON AR.AR_Ref = GS.AR_Ref AND AG.AG_No = GS.AG_No1 AND GS.DE_No = 1
WHERE AR.AR_Sommeil = 0 AND ST.AS_QteSto > 0
GROUP BY AR.AR_Ref, AR.AR_Design, AR.FA_CodeFamille, AR.AR_PrixVen, ST.AS_QteSto
ORDER BY AR.FA_CodeFamille, AR.AR_Design
```

D'autres requêtes ont été construites et validées mais pas encore intégrées au pipeline : **CA mensuel** et **fréquence d'achat par article**. À reprendre si Baptiste en parle.

---

## 5. Charte graphique

**Couleurs (variables CSS déjà en place dans `index.css`)**
| Variable | Valeur | Usage |
|---|---|---|
| `--rose-poudre` | `#F0B8CC` | accents, fonds légers |
| `--rose-profond` | `#C86B8A` | boutons, liens, accents forts |
| `--noir` | `#1A1A1A` | texte principal |
| `--blush` | `#FDF0F4` | fond général du site |
| `--blanc` | — | fonds cartes |
| `--gris-texte` | — | texte secondaire |
| `--radius` / `--radius-lg` | — | arrondis |
| `--shadow-card` | — | ombre des cartes produit |

**Typographies**
- Titres : **Bebas Neue**
- Corps : **Tahoma**
- Chargées via Google Fonts (mentionné dans les mentions légales, voir section 7).

Style général : boutique artisanale féminine, chaleureuse, pas d'esthétique "e-commerce générique".

---

## 6. État d'avancement détaillé par fichier

- **`Catalogue.jsx`** — entièrement réécrit et stabilisé. Filtres repliés par défaut, fourchette de prix 0–50 000 F CFP (double slider + inputs numériques), filtre "Avec photo", bouton "Effacer les filtres" appelant une fonction centralisée `reinitialiserFiltres()` (un seul `setSearchParams` regroupant tous les paramètres — voir piège section 7), surlignage des termes recherchés, recherche avec debounce 300ms et valeur par défaut "pelote", vue grille/liste, tri alphabétique, pagination 26 items/page portée dans les paramètres d'URL (`searchParams`).
- **`ProductCard.jsx`** et **`ProductDetail.jsx`** — réécrits. Logo `/logo.jpg` utilisé en fallback via `backgroundImage` quand pas de photo produit, `objectFit: contain`, fond `var(--blush)`. `ProductDetail.jsx` gère les gammes cliquables, le zoom loupe (`VisualiseurZoom`), et le stock par gamme.
- **`Home.jsx`** — hero avec `/logo.jpg` à gauche et `/images/shop/home-rose.jpg` à droite (alignement `start`, pas `center`, pour corriger un défaut de hauteur de colonnes ; `marginTop: '2.5rem'` sur la photo droite pour l'équilibre visuel). iframe Facebook corrigée : retrait du paramètre `adapt_container_width=true` (il nécessite le SDK JS complet et cause un chargement infini en iframe brut), crop CSS via `marginTop: '-70px'` sur l'iframe dans un conteneur à hauteur fixe et `overflow: hidden` pour masquer le bandeau d'en-tête imposé par le plugin.
- **`Navbar.jsx`** — logo affiché conditionnellement : masqué sur la home tant que le scroll est < 20px (état `scrolled` existant), toujours visible sur les autres pages, transition `opacity` 0.3s, `pointerEvents: 'none'` quand masqué.
- **`Legal.jsx`** — refondu avec mentions réelles : hébergement Netlify, DNS Cloudflare, Google Fonts, widget Facebook, section RGPD/cookies adaptée au contexte juridique de la Nouvelle-Calédonie (voir section 9).
- **Descriptions produits** — enrichies à partir de sources officielles (Katia, Cheval Blanc, DMC) pour un sous-ensemble de références. Fichier `products_enrichi.csv` généré séparément.
- **`App.jsx`** — contient un composant `ScrollToTop` pour remonter en haut de page à chaque changement de route.

### Chantiers en cours (non finalisés)
1. **Automatisation pipeline** : connexion Python directe à Sage via `pyodbc`, avec `git push` automatique déclenché par une tâche planifiée Windows quotidienne. Objectif : supprimer l'étape manuelle d'export ODS.
2. **Workflow n8n** pour enrichir les descriptions produits restantes : Google Sheets → Custom Search API → Jina AI Reader → Claude Haiku → réinjection CSV. Conçu dans le détail mais mise en place technique mise de côté temporairement — Baptiste dispose déjà d'une instance n8n (`https://app.zenkai.nc/mcp-server/http`).
3. **Travail sur les images produits** en cours (nommage, qualité, gammes).
4. **Intégration des requêtes SQL** CA mensuel et fréquence d'achat — construites, pas encore branchées à une interface.

---

## 7. Pièges déjà rencontrés — ne pas les refaire

- **Bug de batching `setSearchParams`** : appeler plusieurs setters de `searchParams` en séquence dans un même handler écrase les appels précédents, car chacun repart du même snapshot React figé (stale closure). **Solution appliquée** : un seul appel `setSearchParams` regroupant tous les paramètres à la fois, centralisé dans une fonction comme `reinitialiserFiltres()`. Respecter ce pattern pour toute nouvelle fonctionnalité de filtre.
- **Cloudflare / Let's Encrypt** : avoir plusieurs A records sur l'apex domain provoque des validations ACME aléatoires et inconsistantes. **Ne garder qu'un seul A record** (`75.2.60.5`, celui de Netlify) sur l'apex `zenkai.nc`.
- **Facebook Page Plugin** : le paramètre d'URL `adapt_container_width=true` nécessite le SDK JS complet de Facebook ; utilisé avec un `<iframe>` brut, il cause un chargement infini. Solution : retirer ce paramètre et masquer le bandeau d'en-tête du plugin par un crop CSS (`overflow: hidden` + `marginTop` négatif).
- **Netlify build minutes (plan gratuit)** : chaque `git push` déclenche un rebuild. Pour éviter de saturer le quota avec des micro-commits pendant le développement local, l'extension VS Code **GitDoc** a été suggérée (auto-commit avec délai d'inactivité configurable, ex. 60 secondes), à activer/désactiver selon la phase de travail.

---

## 8. Comment travailler avec Baptiste — règles de conversation

C'est la section la plus importante pour Claude Code : elle décrit le *style* attendu, pas seulement la technique.

- **Baptiste est novice.** Toujours vulgariser : expliquer le *pourquoi* d'un choix technique avant ou en même temps que le *comment*, sans jargon non expliqué. Un développeur senior n'a pas besoin qu'on lui dise pourquoi `useState` déclenche un re-render ; Baptiste, si.
- **Réécriture complète plutôt qu'édition partielle accumulée** : quand un composant accumule des erreurs de structure JSX au fil des modifications, préférer une réécriture complète et propre du fichier plutôt que d'empiler des correctifs. Baptiste préfère un fichier stable et lisible à un historique de patches.
- **Déploiement toujours simple et explicite** : `git add . && git commit -m "..." && git push` → Netlify rebuild automatique. Ne pas complexifier ce cycle sans raison forte (CI/CD avancé, etc. — seulement si explicitement demandé).
- **Sur claude.ai, tout code était livré directement dans le chat**, jamais en fichier à télécharger, car Baptiste copiait-collait lui-même dans VS Code. **Sous Claude Code, ce n'est plus une contrainte** : Claude Code peut et doit modifier les fichiers directement dans le dépôt (c'est tout l'intérêt de la bascule). Mais garder le réflexe d'expliquer clairement *quel fichier* a été modifié et *pourquoi*, comme si Baptiste devait comprendre le diff.
- **Devis et documents clients** (ex. devis professionnel v3 : 8 postes, 4 sections, abonnement maintenance mensuel séparé, conditions de paiement 40/40/20%) sont rédigés en langage entièrement vulgarisé, zéro jargon technique — cette exigence de vulgarisation s'applique aussi en dehors du code, dès que Baptiste doit faire lire quelque chose à sa cliente (la gérante de la mercerie).
- **Ton** : chaleureux, direct, pas de sur-formalisme. Baptiste pose souvent des questions courtes et pratiques ("c'est quoi déjà la commande pour...") — y répondre de façon concrète et actionnable, sans détour.

---

## 9. RGPD, cookies, sécurité

- Le site utilise un bandeau de consentement (`CookieBanner.jsx`) et une page mentions légales (`Legal.jsx`) traitant RGPD et cookies.
- Cookies utilisés : uniquement un cookie de consentement (aucune donnée personnelle transmise) + cookies tiers potentiels du widget Facebook intégré en page d'accueil (hors contrôle du site, déclenchés seulement si l'utilisateur interagit avec le widget).
- Aucun cookie publicitaire, de tracking ou d'analyse d'audience.
- **Contexte juridique** : la boutique est en Nouvelle-Calédonie. Le RGPD européen ne s'applique pas directement, mais les mentions légales engagent La Grande Mercerie à en respecter les principes fondamentaux (collecte minimale, finalité explicite, durée de conservation limitée, sécurisation des données) — formulation à conserver telle quelle dans `Legal.jsx` si on retouche cette page.
- **Principe RGPD général à retenir** (applicable à ce projet et transposable à d'autres) : les articles 13/14 exigent la transparence sur les *catégories* de sous-traitants et le type de traitement, mais **pas obligatoirement leurs noms précis**. Des descriptions fonctionnelles (« hébergeur du site », « prestataire DNS ») suffisent si Baptiste souhaite un jour anonymiser les mentions techniques.
- Propriété intellectuelle : le contenu du site appartient à La Grande Mercerie ; les marques/visuels des produits (DMC, Katia, Cheval Blanc, Bohin, Prym, Hoooked...) restent la propriété de leurs détenteurs respectifs — à rappeler dans toute page mentions légales.

---

## 10. Commandes utiles

```bash
# Lancer le site en local
npm install   # seulement si nouvelles dépendances ou nouvelle machine
npm run dev   # démarre Vite, généralement sur http://localhost:5173, hot-reload actif

# Build de production (Netlify le fait automatiquement au push, rarement nécessaire en local)
npm run build
npm run preview
```

---

## 11. Ce que Claude Code doit garder en tête en permanence

1. Ne jamais casser le contrat de données `products.csv` (colonnes, format `stocks_gammes`) sans adapter `useProducts.js` en conséquence.
2. Ne jamais introduire une dépendance lourde ou un changement d'architecture (state management externe, framework CSS, etc.) sans que Baptiste l'ait explicitement demandé — le site est volontairement simple (React + Vite + CSV statique).
3. Respecter le pattern `setSearchParams` centralisé pour tout ce qui touche aux filtres/URL du catalogue.
4. Vulgariser systématiquement les explications, même techniques.
5. Le `netlify.toml` avec la redirection SPA est indispensable — ne pas y toucher sans comprendre que toutes les routes React Router dépendent de ce redirect.
