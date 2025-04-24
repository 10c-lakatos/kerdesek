# Kérdések feltevése adott témakörökről (Adatbázissal) (Weboldal)

## Jellemzők

- MySQL adatbázis
- Node.js Express

## Leírás

Kérdéseket lehet feltenni egy adott feladatlap adott feladataival kapcsolatban. Ezek a kérdések mentődnek, és a **kerdesek.html** oldalon megtekinthetők!

## FONTOS!

Hozzon létre egy .env fájlt saját tokennel a .gitignore miatt!

*Példa:*

```
JWT=RandomBiztosToken123VeszpremiSzakkepzesiCentrumIpariTechnikumALegjobbHely
```

*A JWT szerepeljen az env nevének különben nem fog működni a backend!*

## Alapvető tudnivalók a futtatáshoz

- Az adatbázis neve legyen: **kerdesek**
- Az adatbázis struktúráját az **alapstruktura.sql** fájl tartalmazza.

### Node.js csomagok amik szerepelnek a node_modules-ban:
- Express
- Nodemon
- Cors
- MySQL2

## Szerver futtatása:

```
npm run start
```

### Telepítés

Másolja le lokális repóba, majd adja ki a szerver futtatásához szükséges parancsot (nodemon server) a ./server mappában, majd VS Code Live Serverrel nyissa meg az index.html-t és már működni is fog az oldal!
