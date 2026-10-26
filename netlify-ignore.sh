#!/bin/bash
# Netlify lance ce script avant chaque build.
#   exit 1 → on CONSTRUIT le site
#   exit 0 → on IGNORE ce push (pas de build, pas de crédit consommé)

AVANT="$CACHED_COMMIT_REF"   # dernière version mise en ligne
APRES="$COMMIT_REF"          # version qui vient d'être poussée

# Premier build, relance manuelle, ou ancienne version introuvable : on construit
if [ -z "$AVANT" ] || [ "$AVANT" = "$APRES" ] || ! git cat-file -e "$AVANT" 2>/dev/null; then
  echo "Build : premier déploiement ou relance manuelle."
  exit 1
fi

# 1. Le CODE du site a changé → mise en ligne immédiate
if ! git diff --quiet "$AVANT" "$APRES" -- src index.html package.json package-lock.json vite.config.js netlify.toml netlify-ignore.sh; then
  echo "Build : le code du site a changé."
  exit 1
fi

# 2. Demande explicite : un message de commit contenant [deploy]
if git log --format=%B "$AVANT..$APRES" | grep -qF "[deploy]"; then
  echo "Build : demande explicite [deploy]."
  exit 1
fi

# 3. Synchro quotidienne du pipeline : on met en ligne tout ce qui
#    s'est accumulé dans public/ (back-office, photos, catalogue)
if git log --format=%s "$AVANT..$APRES" | grep -qF "automatique du catalogue"; then
  if ! git diff --quiet "$AVANT" "$APRES" -- public; then
    echo "Build : synchro quotidienne avec des changements à publier."
    exit 1
  fi
  echo "Pas de build : synchro quotidienne sans changement visible."
  exit 0
fi

# 4. Tout le reste (modifs back-office, photos…) attend la prochaine synchro
echo "Pas de build : changement de données, publié à la prochaine synchro."
exit 0