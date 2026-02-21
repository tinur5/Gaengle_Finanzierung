# Gängle Finanzierung

Moderne Webseite zur Visualisierung der Finanzierung eines 3-Parteien Stockwerkeigentums.

## 🚀 Quick Start

### Lokal testen
```bash
npm run dev
# Öffne http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

## 📊 Features

- ✅ **Interaktive Charts** - Bar und Pie Charts mit Recharts
- ✅ **Detaillierte Tabellen** - Kostenaufschlüsselung nach Partei
- ✅ **Moderne UI** - Tailwind CSS Design
- ✅ **Responsive** - Funktioniert auf allen Geräten
- ✅ **Deutsch** - Vollständig auf Deutsch

## 🏗️ Technologie

- **Next.js 16** - React Framework
- **Tailwind CSS** - Styling
- **Recharts** - Datenvisualisierung
- **TypeScript** - Typsicherheit
- **Vercel** - Hosting & Deployment

## 📁 Struktur

```
├── app/              # Next.js App Router
├── components/       # React Komponenten
├── lib/              # Utilities & Typen
├── public/           # Statische Dateien
├── scripts/          # Build-Skripte
└── README.md         # Diese Datei
```

## 🔧 Entwicklung

### Dependencies installieren
```bash
npm install
```

### Neue Abhängigkeiten hinzufügen
```bash
npm install <package-name>
```

### Linter ausführen
```bash
npm run lint
```

## 📈 Daten aktualisieren

Excel-Daten in JSON konvertieren:
```bash
node scripts/parseExcel.js
```

## 🌐 Deployment

### GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ganglefinanzierung.git
git push -u origin main
```

### Vercel
1. Gehe zu [vercel.com](https://vercel.com)
2. "New Project" → GitHub Repository auswählen
3. Deploy!

Siehe auch: [DEPLOYMENT.md](./DEPLOYMENT.md) und [SETUP_GUIDE.html](./SETUP_GUIDE.html)

## 📝 Lizenz

Privat

## 📞 Kontakt

Gängle Finanzierung Team
