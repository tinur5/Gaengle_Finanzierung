# 📤 GitHub & Vercel Upload - Schritt-für-Schritt Anleitung

## 🎯 Ziel
Deine Website live auf GitHub hochladen und auf Vercel deployen

---

## ⏱️ Zeitaufwand
- GitHub: ~5 Minuten
- Vercel: ~10 Minuten
- **Total: ~15 Minuten**

---

## 📋 Voraussetzungen

✅ **Bereits erledigt:**
- Next.js App erstellt
- Komponenten fertig
- Build erfolgreich getestet
- Git lokal initialisiert

❌ **Du brauchst:**
- GitHub Konto (kostenlos auf https://github.com)
- Vercel Konto (kostenlos auf https://vercel.com)
- Internet-Verbindung

---

## 🚀 GITHUB UPLOAD

### ⏰ Dauer: ~5 Minuten

### Schritt 1: GitHub Repository erstellen

1. Öffne https://github.com/new
2. Melde dich an (falls nötig)
3. Fülle das Formular aus:

```
Repository name:     ganglefinanzierung
Description:         Finanzierungsvisualisierung für 3-Parteien Stockwerkeigentum
Visibility:          Public oder Private (egal)
Initialize:          NICHTS aktivieren!
```

4. Klicke "Create repository"
5. **Notiere die URL!** Sieht so aus:
   ```
   https://github.com/DEIN_USERNAME/ganglefinanzierung.git
   ```

### Schritt 2: Remote hinzufügen

Öffne **PowerShell** und führe aus:

```powershell
cd "c:\Users\tinur\OneDrive\Hausbauen\Stockwerkeigentum_Finanzierung\ganglefinanzierung"
```

Dann (ersetze `DEIN_USERNAME`):
```powershell
git remote add origin https://github.com/DEIN_USERNAME/ganglefinanzierung.git
```

✅ **Keine Fehlermeldung = OK**

### Schritt 3: Branch umbenennen (Falls nötig)

```powershell
git branch -M main
```

### Schritt 4: Hochladen!

```powershell
git push -u origin main
```

**Du wirst gefragt nach:**
- GitHub Username
- GitHub Token/Passwort

⚠️ **Wichtig:** Verwende **KEINEN** normalen Password! Stattdessen:
- Entweder: Personal Access Token
- Oder: GitHub CLI Authentifizierung

#### Wenn du keinen Token hast:

1. Gehe zu https://github.com/settings/tokens/new
2. Wähle "Generate new token (classic)"
3. Häkchen bei `repo` setzen
4. "Generate token" klicken
5. Token kopieren
6. Verwende Token statt Passwort

### ✅ Erfolg!

Wenn alles ok:
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Delta compression using up to 8 threads
Compressing objects: 100% (45/45), done.
Writing objects: 100% (50/50), 5.00 MiB | 1.25 MiB/s, done.
Total 50 (delta 5), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (5/5), done.
To https://github.com/YOUR_USERNAME/ganglefinanzierung.git
 * [new branch]      main -> main
Branch 'main' is set up to track 'origin/main'.
```

🎉 **Code ist jetzt auf GitHub!**

---

## ☁️ VERCEL DEPLOYMENT

### ⏰ Dauer: ~10 Minuten

### Schritt 1: Vercel anmelden

1. Gehe zu https://vercel.com
2. Klicke "Sign Up"
3. Wähle "Continue with GitHub"
4. Autorisiere GitHub (wenn gefragt)
5. Fertig!

### Schritt 2: Neues Projekt erstellen

1. Im Vercel Dashboard: Klicke "New Project"
2. Wähle "Import Git Repository"
3. Falls nicht verbunden: GitHub-Konto autorisieren

### Schritt 3: Repository auswählen

1. Im Suchfeld eingeben: `ganglefinanzierung`
2. Dein Repository sollte erscheinen
3. Klicke "Import"

### Schritt 4: Build-Einstellungen

**Überprüfe folgende Settings** (sollten voreingestellt sein):

```
Framework Preset:      Next.js
Build Command:         npm run build
Output Directory:      .next
Install Command:       npm ci
```

Klicke **NICHTS** ändern, falls es stimmt!

### Schritt 5: Deploy starten

1. Klicke "Deploy"
2. Warte auf die Meldung "Production"
3. Dies dauert 2-3 Minuten

**Während des Deployments siehst du:**
```
▲ Building...
✓ Build completed in 1m 23s
✓ Deploying...
✓ Production deployment complete
```

### ✅ Live!

Nach dem Deploy siehst du:
- ✅ Production Deployment Badge
- 🌐 **Live URL** (z.B. https://ganglefinanzierung.vercel.app)

🎉 **Website ist jetzt LIVE!**

---

## 🔍 Verifikation

### Teste die Website:

1. Öffne deine Vercel URL im Browser
2. Du solltest sehen:
   - Header mit "Gängle Finanzierung"
   - 3 Karten (Wetli, Graf, Bürzle)
   - Bar Chart und Pie Chart
   - Detaillierte Kostenübersicht

### Troubleshooting:

**Weiße Seite / 404?**
- Warten: ~30 Sekunden Caching
- Browser-Cache leeren: Ctrl+Shift+Delete

**Charts nicht sichtbar?**
- Öffne Developer Tools: F12
- Siehst du Fehler? Melde dich ab und an

**Vercel Build-Fehler?**
- Klicke im Vercel Dashboard auf "Deployments"
- Siehe "Build logs" für Fehlerdetails

---

## 🔄 Zukünftige Updates

Nach dem ersten Deployment ist alles automatisch!

### So machst du Updates:

1. Mache Änderungen lokal
2. Teste mit `npm run dev`
3. Commit & Push zu GitHub:
   ```bash
   git add .
   git commit -m "Update: Beschreibung"
   git push
   ```
4. Vercel deployt automatisch! 🚀

---

## 📊 Git Workflow für Zukunft

```bash
# 1. Änderungen machen
# 2. Testen lokal

npm run dev

# 3. Versionieren
git add .
git commit -m "Beschreibung der Änderung"

# 4. Hochladen
git push origin main

# Vercel updated automatisch!
```

---

## 🎨 Optional: Weitere Anpassungen

Nach dem Deployment kannst du noch folgendes tun:

### Custom Domain
In Vercel Dashboard:
1. Settings → Domains
2. Gib deine Domain ein
3. Befolge die DNS-Anweisungen

### Environment Variables
In Vercel Dashboard:
1. Settings → Environment Variables
2. Key-Value Paare hinzufügen
3. Auto-redeploy

### Deployment Preview
Automatisch bei jedem Git Push ein Preview!

---

## 📞 Hilfe & Support

| Problem | Lösung |
|---------|--------|
| Git push schlägt fehl | Token statt Passwort verwenden |
| Vercel build Error | Logs im Dashboard anschauen |
| Website wird nicht angezeigt | Browser-Cache leeren |
| Daten veraltet | parseExcel.js nochmal ausführen |

---

## ✨ Zusammenfassung

```
Lokal entwickelt ✅
     ↓
GitHub hochgeladen ✅
     ↓
Vercel deployed ✅
     ↓
Live online 🎉
```

**Glückwunsch! 🎉 Deine Website ist jetzt live!**

---

**Nächste Schritte:**
1. Teile den Link mit den anderen Parteien
2. Sammle Feedback
3. Mache Updates (Git Push → Auto-Deploy)
4. Fügei ggf. mehr Funktionen hinzu

**Fragen? Siehe PROJECT_SUMMARY.md oder DEPLOYMENT.md**
