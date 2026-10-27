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
