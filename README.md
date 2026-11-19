# Random Autofocus

Digitale Umsetzung von Mark Forsters Autofocus-System als Web-App (PWA).

**App:** https://blkrk4000.github.io/Random-Autofocus/

## Funktionen

- Aufgaben auf Notizbuch-Seiten, Seitengröße einstellbar (kompakt, normal, großzügig)
- Zufallsauswahl: würfelt die nächste Aufgabe, auch nur innerhalb des Fokus-Modus
- Aufgaben erledigen, verschieben (dismiss), abbrechen und neu eintragen
- Tags mit `@` und `#`, Suche, Mehrfachauswahl, `@routine` für wiederkehrende Checklisten
- Fokus-Liste, Pomodoro-Timer mit Pause und Ton
- Themes, Dark Mode, Schriftwahl, Tastaturkürzel, Undo (50 Schritte)
- Export und Import (JSON, Markdown), Archivieren erledigter Aufgaben
- Offline nutzbar und installierbar

Alle Daten liegen nur lokal im Browser (`localStorage`), es gibt keinen Server und keinen Sync. Deshalb regelmäßig exportieren.

## Technik

React 18, TypeScript, Vite, Tailwind CSS 3, lucide-react. Schriften lokal über Fontsource.

## Entwicklung

```
npm install
npm run dev
```

## Veröffentlichung

Jeder Push auf `main` baut die App per GitHub Actions und veröffentlicht sie auf GitHub Pages (`.github/workflows/deploy.yml`).
