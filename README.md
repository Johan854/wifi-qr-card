# Wi‑Fi QR Card (FR)

Carte Home Assistant qui affiche le QR code de connexion Wi‑Fi (le scan connecte directement le téléphone), le nom du réseau, un mot de passe masqué avec boutons **afficher** et **copier**, et une **image de fond au choix**. Style verre, thème clair/sombre automatique, éditeur visuel, textes en français.

## Installation (HACS)
1. HACS → ⋮ → *Dépôts personnalisés* → `https://github.com/Johan854/wifi-qr-card`, catégorie **Tableau de bord**.
2. Installer, puis recharger le navigateur.

## Exemple
```yaml
type: custom:wifi-qr-card
title: Wi‑Fi invités
ssid: Mon-Reseau
security: WPA2                 # affiché à côté du nom (facultatif)
qr_image: /local/wifi/qr.png   # image du QR code (dans /config/www/wifi/)
# qr_entity: image.wifi_qr     # ou une entité image
password: "…"                  # facultatif : active « afficher / copier »
image: /local/wifi/fond.jpg    # image de fond (facultatif)
image_opacity: 0.35
qr_size: 15
```

Le QR code doit contenir le texte `WIFI:T:WPA;S:nom;P:motdepasse;;`. Le mot de passe saisi dans la carte sert uniquement au bouton afficher / copier et reste dans la configuration de ton tableau de bord (ne partage pas cette configuration).

## Apparence : nuance de couleur

Dans l'éditeur visuel, à côté du thème :

| Option | Valeurs |
|---|---|
| `nuance` | `theme` (par défaut), `braise`, `ocean`, `lagon`, `foret`, `lavande`, `framboise`, `ambre`, `ardoise`, `perso` |
| `nuance_perso` | Couleur au choix (sélecteur de couleur), utilisée avec `nuance: perso` |
| `intensite` | De `0` (neutre) à `2` (très coloré), `1` par défaut |

La nuance teinte le dégradé de fond (et la couleur d'accent quand la carte en a une). Les couleurs d'état (vert, orange, rouge…) ne changent pas.

**Une seule nuance pour toutes les cartes Johan854** : laisse `nuance: theme` et ajoute à ton thème Home Assistant :

```yaml
carte-nuance: "#2f8fd8"
```

Sans cette ligne, `nuance: theme` garde les couleurs d'origine de la carte.

## Historique des versions

- **1.1.0** : nuance de couleur au choix (8 nuances, couleur personnalisée, intensité, ou nuance commune via `carte-nuance` dans le thème).

## QR code masqué (v1.2.0)
Par défaut (`qr_hidden: true`), le QR code n'est pas affiché ni même chargé : un bouton **Afficher le QR code** le révèle, puis il se remasque tout seul après `qr_auto_hide` secondes (60 par défaut, `0` = jamais) ou en quittant la vue. Pour le garder toujours visible : `qr_hidden: false`.
