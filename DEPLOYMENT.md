# Deployment Guide - Gängle Finanzierung

## GitHub Setup

Das Projekt ist bereits initialisiert und versioniert. Folgende Schritte sind notwendig, um den Code auf GitHub hochzuladen:

### 1. Neues Repository auf GitHub erstellen

1. Gehe zu [github.com/new](https://github.com/new)
2. Repository-Name: `ganglefinanzierung`
3. Beschreibung: `Finanzierungsvisualisierung für 3-Parteien Stockwerkeigentum`
4. Public oder Private (nach Wunsch)
5. Klicke "Create repository"

### 2. Remote hinzufügen und pushen

Führe folgende Befehle im Terminal aus:

```bash
cd c:\Users\tinur\OneDrive\Hausbauen\Stockwerkeigentum_Finanzierung\ganglefinanzierung

# Remote hinzufügen (ersetze YOUR_USERNAME durch dein GitHub Username)
git remote add origin https://github.com/YOUR_USERNAME/ganglefinanzierung.git

# Branch umbenennen falls nötig
git branch -M main

# Code hochladen
git push -u origin main
```

## Vercel Deployment

### 1. Mit GitHub verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. Melde dich an oder registriere dich
3. Klicke "New Project"
4. Wähle "Import Git Repository"
5. Verbinde dein GitHub-Konto
6. Wähle das Repository `ganglefinanzierung`

### 2. Automatisches Deployment konfigurieren

- **Framework Preset**: Next.js (wird automatisch erkannt)
- **Build Command**: `npm run build` (voreingestellt)
- **Output Directory**: `.next` (voreingestellt)
- **Environment Variables**: Keine erforderlich

3. Klicke "Deploy"

Das war's! Deine Website ist jetzt live auf einer Vercel-URL wie:
- `https://ganglefinanzierung.vercel.app`

### 3. Custom Domain (optional)

Unter "Settings" → "Domains" kannst du eine eigene Domain verbinden.

## Automatische Deployments

Nach dem ersten Deployment werden automatisch neue Versionen deployed, wenn du:
- In den `main`-Branch pushst
- Pull Requests erstellst (Preview Deployment)

## Lokale Entwicklung

```bash
# Development Server starten
npm run dev

# Browser öffnen
# http://localhost:3000
```

Änderungen werden sofort ohne Neuladen sichtbar (Hot Reload).

## Troubleshooting

### Build fehlgeschlagen?
Überprüfe die Logs im Vercel Dashboard unter "Deployments"

### Daten werden nicht angezeigt?
Stelle sicher, dass `lib/financingData.json` existiert:
```bash
node scripts/parseExcel.js
```

### Port 3000 bereits in Nutzung?
```bash
npm run dev -- -p 3001
```

---

**Weitere Hilfe**: 
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
