# La Grande Mercerie — Site Web

Site vitrine et catalogue construit avec React + Vite, déployé sur Netlify.

---

## 🚀 Structure du projet

```
la-grande-mercerie/
├── public/
│   ├── products.csv          ← VOTRE CATALOGUE (à modifier)
│   ├── favicon.svg
│   └── images/
│       └── products/         ← Vos photos produits ici
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── CookieBanner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalogue.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Legal.jsx
│   ├── hooks/
│   │   └── useProducts.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

---

## 📋 Gérer le catalogue — fichier CSV

Le catalogue est entièrement géré via le fichier `public/products.csv`.

### Colonnes disponibles

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `id` | Identifiant unique | `001` |
| `nom` | Nom du produit | `Fil DMC Rouge` |
| `categorie` | Catégorie (crée le filtre automatiquement) | `Fils` |
| `prix` | Prix en euros (nombre décimal) | `1.50` |
| `description` | Description courte | `Fil coton 8m` |
| `dispo` | Disponibilité | `true` ou `false` |
| `image` | Nom du fichier image (dans `/public/images/products/`) | `fil-rouge.jpg` |

### Comment modifier le catalogue
1. Ouvrir `public/products.csv` dans Excel ou Google Sheets
2. Ajouter / modifier / supprimer des lignes
3. Sauvegarder en format `.csv` (encodage UTF-8)
4. Déposer le fichier sur GitHub → le site se met à jour automatiquement

---

## 🖼️ Ajouter des photos produits

1. Préparer l'image (format JPG ou PNG, carré recommandé)
2. Déposer dans le dossier `public/images/products/`
3. Dans le CSV, renseigner le nom du fichier dans la colonne `image`

---

## 📘 Mettre à jour les posts Facebook (page d'accueil)

Ouvrir `src/pages/Home.jsx` et modifier le tableau `facebookPosts` :

```js
const facebookPosts = [
  {
    id: 1,
    texte: "Votre texte de publication...",
    date: "Il y a 2 jours",
    emoji: "🧵",
  },
  // ...
]
```

---

## ✏️ Personnaliser les informations

- **Adresse / téléphone / email** → `src/pages/Contact.jsx`
- **Lien Facebook** → `src/pages/Home.jsx` (chercher `facebook.com/lagrandemercerie`)
- **Texte "À propos"** → `src/pages/About.jsx`
- **Mentions légales** → `src/pages/Legal.jsx`
- **Couleurs** → `src/index.css` (variables CSS en haut du fichier)

---

## 🌐 Déployer sur Netlify

1. Pousser ce dossier sur GitHub
2. Connecter Netlify au dépôt GitHub
3. Paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
4. Cliquer "Deploy" → le site est en ligne !

---

## 🔧 Développement local

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173
