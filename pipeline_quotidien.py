"""
╔══════════════════════════════════════════════════════════════╗
║   LA GRANDE MERCERIE — Pipeline quotidien automatisé          ║
║                                                                ║
║  Principe :                                                    ║
║  1. Se connecte directement à Sage 100 (plus d'export ODS)     ║
║  2. Scanne le dossier images/products pour les images dispo    ║
║  3. Génère products.csv directement dans public/ du site       ║
║  4. Fait le git add / commit / push automatiquement            ║
║  5. Écrit un journal (log) du déroulement, pour vérif le matin ║
╚══════════════════════════════════════════════════════════════╝

À LANCER SUR LE PC DE LA BOUTIQUE (celui qui héberge Sage), PAS sur
le PC de Baptiste. C'est ce PC qui a accès en local à la base SQL.

UTILISATION MANUELLE (pour tester) :
  python pipeline_quotidien.py

UTILISATION AUTOMATIQUE :
  Lancé chaque nuit par une tâche planifiée Windows (voir notes en
  bas de fichier / message de Claude).

DÉPENDANCES :
  pip install pandas pyodbc
  + driver "ODBC Driver 17 for SQL Server" installé sur la machine
"""

import pandas as pd
import pyodbc
import re
import os
import sys
import subprocess
import logging
import base64
import json
import urllib.request
from datetime import datetime

# ─────────────────────────────────────────────
# CONFIGURATION — à adapter une seule fois
# ─────────────────────────────────────────────

# Chemin vers le dossier du dépôt Git cloné SUR CE PC (le PC boutique)
DOSSIER_REPO = r"C:\site-internet\la-grande-mercerie"

FICHIER_DESCRIPTIONS = "descriptions_manuelles.csv"
FICHIER_NOMS         = "noms_manuels.csv"
FICHIER_CSV_SORTIE   = os.path.join(DOSSIER_REPO, "public", "products.csv")
DOSSIER_IMAGES       = os.path.join(DOSSIER_REPO, "public", "images", "products")
DOSSIER_LOGS         = os.path.join(DOSSIER_REPO, "logs")

# Back-office (tableau de bord) — mêmes identifiants que le Basic Auth du Caddyfile
DASHBOARD_URL          = "https://app.zenkai.nc/lagrandemercerie/site-internet/api/sync-status"
DASHBOARD_UTILISATEUR  = "astrid"
DASHBOARD_MOT_DE_PASSE = "LGM@98"  # ⚠️ remplacer par le vrai mot de passe du Caddyfile avant utilisation

RENOMMER_FAMILLES = {
    "PTMERCERIE":  "Petite mercerie",
    "AIGUEPING":   "Aiguilles & épingles",
    "THERMO":      "Thermocollant",
    "DENTELLES":   "Dentelles",
    "RUBANS":      "Rubans",
    "BRODERIE":    "Broderie",
    "BOUTONS":     "Boutons",
    "LAINE":       "Laine",
    "FILS":        "Fils",
    "ELASTIQUES":  "Élastiques",
    "LINGERIE":    "Lingerie",
    "CISEAUX":     "Ciseaux",
    "BIAIS":       "Biais",
    "AMEUBLEMEN":  "Ameublement",
    "AMEUBLEM":    "Ameublement",
    "FERMETURES":  "Fermetures",
    "FERMETUR":    "Fermetures",
    "TISSU":       "Tissus",
    "CORDONS":     "Cordons",
    "LACETS":      "Lacets",
    "VELCROS":     "Velcros",
    "LIVRES":      "Livres",
    "SANGLES":     "Sangles",
}

REFS_EXCLURE_SITE = {
    '0349_10', '101', '103', '1059N_38', '117', '120049', '120071', '120074',
    '120089', '120090', '120094', '120139', '120145', '120168', '120196',
    '120208', '120210', '120211', '120213', '120224', '120225', '120236',
    '120244', '120245', '120252', '120274', '120276', '120292', '120297',
    '120322', '120327', '120342', '120349', '120354', '120355', '120356',
    '120384', '120391', '120395', '120407', '120421', '120442', '120445',
    '120450', '120484', '120521', '120524', '120587', '120620', '120633',
    '120634', '120653', '120681', '120692', '120699', '120703', '120712',
    '120724', '1306', '1349', '140110', '1595_10MM', '1661', '20302',
    '23060', '25309.15', '25309.25', '260023', '260026', '260027', '260033',
    '260036', '260037', '260044', '260045', '260046', '260047', '40175',
    '410476', '420028', '420032', '420034', '420043', '420044', '420047',
    '420052', '420054', '420055', '420056', '420057', '420071', '420092',
    '420827', '427', '4458', '480008_U', '480010_U', '480020', '480029',
    '480033', '480035', '480044', '480054', '480059', '480260', '480355',
    '502', '510003', '510004', '510006', '510007', '510008', '510020',
    '510021', '510025', '510046', '510070', '560075', '560108', '560148',
    '560152', '560155', '560159', '560194', '560196', '62452', '62456',
    '62457', '62597', '6560', '8112', '91750', '9510_4', '994181', '994186',
    '994187', '994191', 'ART161801', 'BERGAMOTE', 'BI211', 'BIA39_30',
    'BIA75_30', 'BRO_2', 'BRO_4', 'BRO_51', 'BRO_54', 'BRO_86', 'BRO_89',
    'CELEST', 'CF137', 'ECOLIFE_RIBBON', 'ERF.275062', 'FIDELITE', 'FIL_1',
    'FIL_2', 'FIL_3', 'HA77175', 'K2059', 'LB205', 'LIN_5', 'LIN_6',
    'LIN_7', 'MACARON', 'MALMOE', 'N4431', 'OLYMPIE', 'PETIT_PAN', 'PETRA',
    'PHIL_1', 'PHIL_16', 'PHIL_17', 'PHIL_20', 'PHIL_29', 'PINC2', 'PTM_13',
    'PTM_45', 'PTM_46', 'S3205', 'SOLFEGE', 'SONETO', 'TIS_6', 'TIS_7',
    'TIS_COTON', 'TTC_TRIMITS',
}

FAMILLES_EXCLURE = {"PRESTATION", "PORT", "DIVERS", "IDEAL"}

MARQUES_DETECTABLES = ["DMC", "Bohin", "Cheval Blanc", "Hoooked", "Katia", "Prym"]

REFS_FORCEES_BOHIN = {
    "625", "722", "769", "716", "718", "721", "323", "1141", "322", "320",
    "321", "269", "222", "223", "220", "221", "1142", "83099", "622", "610",
    "668", "621", "503", "502", "568", "10006", "10003", "10003_U", "468",
    "772", "770", "880", "870", "780", "232", "12124", "12212", "98963",
    "98419", "93210", "12312", "12314", "12316", "12320", "669", "1099",
    "98410", "98412", "98414", "98405", "932", "878", "826", "828", "830",
    "832", "834", "836", "838", "98406", "930", "83599", "10006_U",
    "768", "504", "12710", "12708", "12712", "12714", "18198", "83899",
    "83999", "616",
}


# ─────────────────────────────────────────────
# JOURNAL (LOG) — pour vérifier le matin ce qui s'est passé
# ─────────────────────────────────────────────

def preparer_logger():
    os.makedirs(DOSSIER_LOGS, exist_ok=True)
    nom_fichier = f"pipeline_{datetime.now().strftime('%Y-%m-%d_%Hh%M')}.log"
    chemin_log = os.path.join(DOSSIER_LOGS, nom_fichier)

    logger = logging.getLogger("pipeline")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()

    handler_fichier = logging.FileHandler(chemin_log, encoding="utf-8")
    handler_fichier.setFormatter(logging.Formatter("%(asctime)s  %(message)s", "%H:%M:%S"))
    logger.addHandler(handler_fichier)

    handler_console = logging.StreamHandler(sys.stdout)
    handler_console.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(handler_console)

    return logger, chemin_log


# ─────────────────────────────────────────────
# CONNEXION SAGE (remplace la lecture de l'ODS)
# ─────────────────────────────────────────────

def recuperer_donnees_sage(logger):
    """Se connecte à Sage 100 en local et récupère le catalogue à jour."""
    connexion = pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        r"SERVER=DESKTOP-EIOV9CB\SAGE100;"
        "DATABASE=GRANDE_MERCERIE;"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )

    requete = """
    SELECT
        AR.AR_Ref                                          AS reference,
        RTRIM(AR.AR_Design)                                AS designation,
        AR.FA_CodeFamille                                  AS famille,
        AR.AR_PrixVen                                       AS prix_vente,
        ST.AS_QteSto                                        AS stock_total,
        STRING_AGG(CAST(AG.EG_Enumere AS NVARCHAR(MAX)), ' | ')
            WITHIN GROUP (ORDER BY AG.AG_No)                AS gammes,
        STRING_AGG(CAST(CAST(GS.GS_QteSto AS INT) AS NVARCHAR(MAX)), ' | ')
            WITHIN GROUP (ORDER BY AG.AG_No)                AS stocks_gammes
    FROM F_ARTICLE AR
    LEFT JOIN F_ARTSTOCK ST ON AR.AR_Ref = ST.AR_Ref AND ST.DE_No = 1
    LEFT JOIN F_ARTGAMME AG ON AR.AR_Ref = AG.AR_Ref
    LEFT JOIN F_GAMSTOCK GS ON AR.AR_Ref = GS.AR_Ref AND AG.AG_No = GS.AG_No1 AND GS.DE_No = 1
    WHERE AR.AR_Sommeil = 0 AND ST.AS_QteSto > 0
    GROUP BY AR.AR_Ref, AR.AR_Design, AR.FA_CodeFamille, AR.AR_PrixVen, ST.AS_QteSto
    ORDER BY AR.FA_CodeFamille, AR.AR_Design
    """

    df = pd.read_sql(requete, connexion)
    connexion.close()
    logger.info(f"   {len(df)} références lues directement depuis Sage.")
    return df


def recuperer_ca_sage(logger):
    """Calcule le CA total par référence depuis les factures Sage de l'année en
    cours (DO_Type=6 = factures, validé sur données réelles). Remplace l'ancien
    export Excel manuel : plus de fichier intermédiaire à tenir à jour à la main."""
    connexion = pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        r"SERVER=DESKTOP-EIOV9CB\SAGE100;"
        "DATABASE=GRANDE_MERCERIE;"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )

    requete = """
    SELECT
        L.AR_Ref                    AS reference,
        SUM(L.DL_MontantHT)         AS ca_ht_total
    FROM F_DOCLIGNE L
    JOIN F_DOCENTETE E
        ON L.DO_Piece = E.DO_Piece
        AND L.DO_Domaine = E.DO_Domaine
        AND L.DO_Type = E.DO_Type
    WHERE E.DO_Domaine = 0
      AND E.DO_Type = 6
      AND E.DO_Date >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
      AND L.AR_Ref != ''
    GROUP BY L.AR_Ref
    ORDER BY ca_ht_total DESC
    """

    df_ca = pd.read_sql(requete, connexion)
    connexion.close()
    logger.info(f"   CA calculé pour {len(df_ca)} références (factures depuis le 1er janvier).")
    return df_ca


# ─────────────────────────────────────────────
# FONCTIONS (identiques à generer_catalogue.py)
# ─────────────────────────────────────────────

def nettoyer_nom(nom):
    nom = str(nom).strip()
    nom = nom.replace('""', '"').strip('"').strip()
    nom = re.sub(r'\s+', ' ', nom)
    nom = re.sub(r'FFERMETURE', 'FERMETURE', nom, flags=re.IGNORECASE)
    remplacements = [
        (r'\bAIG\b\.?',  'Aiguille'),
        (r'\bCIS\b\.?',  'Ciseaux'),
        (r'\bEP\.',      'Épingles'),
        (r'\bANNX\b',    'Anneaux'),
        (r'\bRID\b\.?',  'Rideau'),
        (r'\bPLAST\.',   'Plastique'),
        (r'\bBLC\b',     'Blanc'),
        (r'\bASS\b\.?',  'Assortiment'),
        (r'\bATT\.',     'Attache'),
        (r'\bAGR\b\.?',  'Agrafes'),
        (r'\bBRZ\b\.?',  'Bronze'),
        (r'\bMACH\b\.?', 'Machine'),
        (r'\bCB\b',      'Cheval Blanc'),
    ]
    for pattern, remplacement in remplacements:
        nom = re.sub(pattern, remplacement, nom, flags=re.IGNORECASE)
    nom = re.sub(r'\s+', ' ', nom).strip()
    return nom.title()


def detecter_marque(ref, nom):
    if ref in REFS_FORCEES_BOHIN:
        return 'Bohin'
    for marque in MARQUES_DETECTABLES:
        if re.search(r'\b' + re.escape(marque) + r'\b', nom, flags=re.IGNORECASE):
            return marque
    return ''


def fusionner_stocks_gammes(gammes_str, stocks_str):
    if not gammes_str or not stocks_str:
        return '', ''
    gammes = [g.strip() for g in str(gammes_str).split('|')]
    stocks = [s.strip() for s in str(stocks_str).split('|')]
    if len(gammes) != len(stocks):
        return '', ''
    gammes_ok = []
    paires = []
    for g, s in zip(gammes, stocks):
        try:
            stock_int = int(float(s))
        except (ValueError, TypeError):
            stock_int = 0
        if stock_int > 0:
            gammes_ok.append(g)
            paires.append(f"{g}:{stock_int}")
    return ' | '.join(gammes_ok), '|'.join(paires)


def scanner_images(logger):
    extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    images = {}
    if os.path.exists(DOSSIER_IMAGES):
        for fichier in os.listdir(DOSSIER_IMAGES):
            nom, ext = os.path.splitext(fichier)
            if ext.lower() in extensions:
                images[nom.upper()] = fichier
        logger.info(f"   {len(images)} images trouvées dans {DOSSIER_IMAGES}")
    else:
        logger.info(f"   ⚠️  Dossier images introuvable : {DOSSIER_IMAGES}")
    return images


def suffixe_gamme(gamme):
    g = str(gamme).strip()
    g = re.sub(r'\s*-\s*', '-', g)
    g = re.sub(r'\s+', '-', g)
    g = re.sub(r'[^a-zA-Z0-9_-]', '', g)
    return g


def gammes_ont_photos(ref, gammes_filtrees, images_dispo, seuil_proportion=0.5, minimum=2):
    if not gammes_filtrees:
        return False
    liste = [g.strip() for g in str(gammes_filtrees).split('|') if g.strip()]
    if not liste:
        return False
    trouvees = 0
    for g in liste:
        cle = f"{ref}_{suffixe_gamme(g)}".upper()
        if cle in images_dispo:
            trouvees += 1
    proportion = trouvees / len(liste)
    return trouvees >= minimum and proportion >= seuil_proportion


# ─────────────────────────────────────────────
# GIT — add / commit / push automatique
# ─────────────────────────────────────────────

def lancer_commande(commande, logger):
    """Exécute une commande git dans le dossier du repo et journalise le résultat."""
    resultat = subprocess.run(
        commande, cwd=DOSSIER_REPO, capture_output=True, text=True, shell=True
    )
    sortie = (resultat.stdout + resultat.stderr).strip()
    if sortie:
        logger.info(f"   $ {commande}\n   {sortie}")
    return resultat.returncode, sortie


def signaler_dashboard(logger, succes, nb_articles=None, message="",
                        nouvelles_references=None, nouvelles_gammes=None):
    """Envoie le statut de la synchro au back-office (tableau de bord), avec
    éventuellement le détail des nouvelles références/gammes détectées."""
    donnees = json.dumps({
        "succes": succes,
        "nb_articles": nb_articles,
        "message": message,
        "nouvelles_references": nouvelles_references or [],
        "nouvelles_gammes": nouvelles_gammes or [],
    }).encode("utf-8")

    identifiants = base64.b64encode(
        f"{DASHBOARD_UTILISATEUR}:{DASHBOARD_MOT_DE_PASSE}".encode()
    ).decode()

    requete = urllib.request.Request(
        DASHBOARD_URL,
        data=donnees,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {identifiants}",
        },
        method="POST",
    )
    try:
        urllib.request.urlopen(requete, timeout=10)
        logger.info("   ✅ Statut envoyé au tableau de bord.")
    except Exception as e:
        # Ne doit jamais faire planter le pipeline : le dashboard est un bonus, pas une dépendance critique
        logger.info(f"   ⚠️  Impossible de contacter le tableau de bord : {e}")


def publier_sur_git(logger):
    logger.info("")
    logger.info("═" * 60)
    logger.info("  ÉTAPE 6 — Publication Git")
    logger.info("═" * 60)

    lancer_commande("git fetch", logger)
    code, statut = lancer_commande("git status", logger)

    if "Your branch is behind" in statut or "have diverged" in statut:
        logger.info("   ⚠️  Le dépôt local n'est pas à jour, tentative de pull avant push...")
        lancer_commande("git pull", logger)

    lancer_commande("git add .", logger)

    date_du_jour = datetime.now().strftime("%d/%m/%Y")
    message = f"Mise à jour automatique du catalogue - {date_du_jour}"
    code_commit, sortie_commit = lancer_commande(f'git commit -m "{message}"', logger)

    if "nothing to commit" in sortie_commit:
        logger.info("   ℹ️  Aucun changement détecté dans le catalogue aujourd'hui — pas de commit.")
        return

    code_push, sortie_push = lancer_commande("git push", logger)
    if code_push == 0:
        logger.info("   ✅ Catalogue publié sur GitHub, Netlify va reconstruire le site.")
    else:
        logger.info("   ❌ ÉCHEC DU PUSH — à vérifier manuellement ! Voir détail ci-dessus.")


# ─────────────────────────────────────────────
# EXÉCUTION
# ─────────────────────────────────────────────

if __name__ == "__main__":

    logger, chemin_log = preparer_logger()

    try:
        logger.info("═" * 60)
        logger.info(f"  PIPELINE QUOTIDIEN — {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        logger.info("═" * 60)

        logger.info("")
        logger.info("═" * 60)
        logger.info("  ÉTAPE 1 — Connexion à Sage 100")
        logger.info("═" * 60)

        df = recuperer_donnees_sage(logger)

        # Normalisation des colonnes (identique à avant)
        df['reference']     = df['reference'].astype(str).str.strip().str.replace('/', '_', regex=False)
        df['designation']   = df['designation'].fillna('').astype(str).str.strip()
        df['famille']       = df['famille'].fillna('DIVERS').astype(str).str.strip()
        df['prix_vente']    = pd.to_numeric(df['prix_vente'], errors='coerce').fillna(0).astype(int)
        df['stock_total']   = pd.to_numeric(df['stock_total'], errors='coerce').fillna(0).astype(int)
        df['gammes']        = df['gammes'].fillna('').astype(str).str.strip()
        df['stocks_gammes'] = df['stocks_gammes'].fillna('').astype(str).str.strip()

        logger.info("")
        logger.info("═" * 60)
        logger.info("  ÉTAPE 2 — Nettoyage et enrichissement")
        logger.info("═" * 60)

        avant = len(df)
        df = df[~df['famille'].isin(FAMILLES_EXCLURE)]
        logger.info(f"   {avant - len(df)} articles exclus (familles internes).")

        avant = len(df)
        df = df[~df['reference'].isin(REFS_EXCLURE_SITE)]
        logger.info(f"   {avant - len(df)} articles exclus (marqués SITE=N).")

        avant = len(df)
        df = df[df['stock_total'] > 0]
        logger.info(f"   {avant - len(df)} articles hors stock exclus.")

        df['nom'] = df['designation'].apply(nettoyer_nom)

        masque_book = df['nom'].str.contains(r'\bBook\b', case=False, na=False)
        df.loc[masque_book, 'famille'] = 'LIVRES'

        df['categorie'] = df['famille'].apply(
            lambda f: RENOMMER_FAMILLES.get(f.upper(), f.capitalize())
        )

        masque_pelote = df['nom'].str.contains(r'\bpelote\b', case=False, na=False)
        df.loc[masque_pelote, 'categorie'] = 'Pelote'
        logger.info(f"   {masque_pelote.sum()} articles reclassés en catégorie 'Pelote'.")

        df['marque'] = df.apply(
            lambda row: detecter_marque(row['reference'], row['nom']), axis=1
        )

        try:
            df_ca = recuperer_ca_sage(logger)
            df_ca['reference'] = df_ca['reference'].astype(str).str.strip().str.replace('/', '_', regex=False)
            df_ca = df_ca.sort_values('ca_ht_total', ascending=False).reset_index(drop=True)
            df_ca['popularite'] = df_ca.index + 1
            pop_map = df_ca.set_index('reference')['popularite'].to_dict()
            df['popularite'] = df['reference'].map(pop_map).fillna(99999).astype(int)
            logger.info(f"   {df['popularite'].ne(99999).sum()} articles avec score de popularité.")
        except Exception as e:
            df['popularite'] = 99999
            logger.info(f"   ⚠️  Impossible de calculer la popularité depuis Sage : {e}")

        df[['gammes_filtrees', 'stocks_gammes_site']] = df.apply(
            lambda row: pd.Series(fusionner_stocks_gammes(row['gammes'], row['stocks_gammes'])),
            axis=1
        )

        logger.info("")
        logger.info("═" * 60)
        logger.info("  ÉTAPE 3 — Scan des images")
        logger.info("═" * 60)

        images_dispo = scanner_images(logger)

        def trouver_image(ref):
            return images_dispo.get(ref.upper(), '')

        logger.info("")
        logger.info("═" * 60)
        logger.info("  ÉTAPE 4 — Génération du CSV")
        logger.info("═" * 60)

        df['gammes_photos'] = df.apply(
            lambda row: 'oui' if gammes_ont_photos(row['reference'], row['gammes_filtrees'], images_dispo) else 'non',
            axis=1
        )

        csv = pd.DataFrame({
            'id':            df['reference'],
            'nom':           df['nom'],
            'categorie':     df['categorie'],
            'prix':          df['prix_vente'],
            'description':   '',
            'marque':        df['marque'],
            'gammes':        df['gammes_filtrees'],
            'gammes_photos': df['gammes_photos'],
            'stocks_gammes': df['stocks_gammes_site'],
            'stock':         df['stock_total'],
            'dispo':         'true',
            'image':         df['reference'].apply(trouver_image),
            'popularite':    df['popularite'],
        })

        csv = csv.drop_duplicates(subset=['id'])
        csv = csv.sort_values(['categorie', 'nom']).reset_index(drop=True)

        logger.info("")
        logger.info("═" * 60)
        logger.info("  ÉTAPE 5 — Fusion des descriptions manuelles")
        logger.info("═" * 60)

        chemin_desc = os.path.join(DOSSIER_REPO, FICHIER_DESCRIPTIONS)
        nb_descriptions = 0
        if os.path.exists(chemin_desc):
            df_desc = pd.read_csv(chemin_desc, dtype={'id': str})
            df_desc['id'] = df_desc['id'].astype(str).str.strip()
            csv['id'] = csv['id'].astype(str)
            mapping = dict(zip(df_desc['id'], df_desc['description']))
            csv['description'] = csv['id'].map(mapping).fillna(csv['description'])
            nb_descriptions = csv['id'].isin(mapping.keys()).sum()
            logger.info(f"   {nb_descriptions} description(s) manuelle(s) injectée(s).")
        else:
            logger.info(f"   ⚠️  Fichier descriptions introuvable — aucune description ajoutée.")

        # Noms modifiés via le back-office (noms_manuels.csv) — même principe que les
        # descriptions : sans ça, un nom corrigé à la main serait écrasé ici par le
        # nom brut généré depuis Sage à chaque synchro.
        chemin_noms = os.path.join(DOSSIER_REPO, FICHIER_NOMS)
        nb_noms = 0
        if os.path.exists(chemin_noms):
            df_noms = pd.read_csv(chemin_noms, dtype={'id': str})
            df_noms['id'] = df_noms['id'].astype(str).str.strip()
            csv['id'] = csv['id'].astype(str)
            mapping_noms = dict(zip(df_noms['id'], df_noms['nom']))
            csv['nom'] = csv['id'].map(mapping_noms).fillna(csv['nom'])
            nb_noms = csv['id'].isin(mapping_noms.keys()).sum()
            logger.info(f"   {nb_noms} nom(s) manuel(s) injecté(s).")
        else:
            logger.info(f"   ℹ️  Aucun fichier noms_manuels.csv trouvé — normal si jamais utilisé côté back-office.")

        # Détection des nouveautés (avant d'écraser l'ancien fichier) : nouvelles
        # références et nouvelles gammes apparues depuis la dernière synchro,
        # pour alimenter la section "Nouveautés" du tableau de bord.
        nouvelles_references = []
        nouvelles_gammes = []
        if os.path.exists(FICHIER_CSV_SORTIE):
            try:
                ancien = pd.read_csv(FICHIER_CSV_SORTIE, dtype={'id': str})
                anciennes_refs = set(ancien['id'].astype(str))
                ancien_gammes_par_ref = dict(zip(
                    ancien['id'].astype(str),
                    ancien['gammes'].fillna('').astype(str)
                ))

                nouvelles = csv[~csv['id'].astype(str).isin(anciennes_refs)]
                nouvelles_references = [
                    {"id": row['id'], "nom": row['nom']}
                    for _, row in nouvelles.head(50).iterrows()
                ]

                for _, row in csv.iterrows():
                    ref = str(row['id'])
                    if ref not in ancien_gammes_par_ref:
                        continue  # référence nouvelle, déjà comptée ci-dessus
                    anciennes_gammes = {g.strip() for g in ancien_gammes_par_ref[ref].split('|') if g.strip()}
                    nouvelles_gammes_ref = {g.strip() for g in str(row['gammes']).split('|') if g.strip()} - anciennes_gammes
                    if nouvelles_gammes_ref:
                        nouvelles_gammes.append({"id": ref, "nom": row['nom'], "gammes": sorted(nouvelles_gammes_ref)})
                nouvelles_gammes = nouvelles_gammes[:50]

                logger.info(f"   {len(nouvelles_references)} nouvelle(s) référence(s), "
                            f"{len(nouvelles_gammes)} référence(s) avec nouvelle(s) gamme(s).")
            except Exception as e:
                logger.info(f"   ⚠️  Impossible de calculer les nouveautés : {e}")
        else:
            logger.info("   ℹ️  Premier passage, pas d'ancien catalogue pour comparer les nouveautés.")

        # Écriture DIRECTE dans public/ du site : plus de copie manuelle
        csv.to_csv(FICHIER_CSV_SORTIE, index=False, encoding='utf-8')

        logger.info("")
        logger.info("✅ Catalogue généré !")
        logger.info(f"   {len(csv)} articles exportés dans '{FICHIER_CSV_SORTIE}'")
        logger.info(f"   {(csv['image'] != '').sum()} avec image")
        logger.info(f"   {(csv['stocks_gammes'] != '').sum()} avec stocks par gamme")
        logger.info(f"   {(csv['marque'] != '').sum()} avec marque détectée")
        logger.info(f"   {nb_descriptions} avec description enrichie")
        logger.info(f"   {nb_noms} avec nom corrigé manuellement")

        # Publication automatique
        publier_sur_git(logger)
        signaler_dashboard(
            logger, succes=True, nb_articles=len(csv), message="Synchro OK",
            nouvelles_references=nouvelles_references, nouvelles_gammes=nouvelles_gammes,
        )

        logger.info("")
        logger.info(f"📄 Journal complet : {chemin_log}")

    except Exception as e:
        logger.info("")
        logger.info("❌ ERREUR PENDANT LE PIPELINE :")
        logger.info(f"   {type(e).__name__} : {e}")
        logger.info(f"   Voir le détail dans : {chemin_log}")
        signaler_dashboard(logger, succes=False, message=f"{type(e).__name__} : {e}")
        sys.exit(1)
