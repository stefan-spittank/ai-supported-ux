# AI-Supported UX Research 

Dieses Repository enthält Claude Code Agenten, die einen KI-unterstützten UX-Research-Prozess abbilden. Die Agenten übernehmen methodisch anspruchsvolle Auswertungsschritte, die im klassischen Prozess manuell und zeitintensiv sind — und geben dem Team mehr Kapazität für Interpretation, Design-Entscheidungen und Validation.

Die Agenten sind keine Blackboxen: Jede Entscheidung ist im Output nachvollziehbar und kann vom Team hinterfragt oder revidiert werden.

## Verzeichnisstruktur

```
interviews/
├── .claude/
│   └── agents/
│       └── affinity-mapping.md   # Agent-Definition
├── notes/                         # Rohdaten: Interview-Protokolle
│   └── interview_[kürzel].md
├── affinity-mapping/              # Output: Affinity Maps
│   └── [projekt]_affinity-map_[datum].md
└── README.md
```

## Agenten

### 1. `affinity-mapping` — Holtzblatt Affinity Mapping

Wertet Nutzerinterviews nach der [Affinity Mapping Methode von Karen Holtzblatt](https://en.wikipedia.org/wiki/Affinity_diagram) aus. Der Agent liest beliebig viele Interview-Protokolle, clustert alle Notizen in eine vierstufige Hierarchie und ordnet die Cluster optional den psychologischen Grundbedürfnissen nach [Marc Hassenzahl](https://hassenzahl.wordpress.com/) zu.

**Anleitung → siehe unten**

---

## Anleitung: `affinity-mapping`

### Voraussetzungen

- [Claude Code](https://claude.ai/code) ist installiert und im Repository-Verzeichnis geöffnet
- Interview-Protokolle liegen als Markdown-Dateien mit YAML-Frontmatter unter `notes/` vor

### Format der Interview-Protokolle

Jede Protokolldatei benötigt ein YAML-Frontmatter und nummerierte Zeilen als Rohdaten:

```markdown
---
title: "User interview: Projektname"
short label: "kürzel"
date: 2026-04-01
interviewer: "Name"
interviewee: "Name"
minute taker: "Name"
methode: "Semi-structured interview"
length: 45
status: "raw data"
---

1. Erste Beobachtung aus dem Interview
2. Zweite Beobachtung
3. ...
```

Jede nummerierte Zeile wird als eigenständige Notiz behandelt. Der Wortlaut wird vom Agenten nie verändert.

### Modus A — Neue Affinity Map erstellen

1. Claude Code öffnen und den Agenten aufrufen:

   ```
   /agent affinity-mapping
   ```

2. Der Agent fragt nach den Protokoll-Dateien. Pfade angeben, z.B.:

   ```
   notes/interview_fh_hg.md
   notes/interview_mh_je.md
   notes/interview_dw_am.md
   ```

3. Der Agent erstellt die Affinity Map und schreibt sie nach `affinity-mapping/[projektname]_affinity-map_[datum].md`.

### Modus B — Bestehende Affinity Map erweitern

1. Den Agenten aufrufen und Modus B angeben:

   ```
   /agent affinity-mapping
   ```

2. Dem Agenten mitteilen, welche bestehende Map erweitert werden soll und welche neuen Protokolle hinzukommen:

   ```
   Erweitere affinity-mapping/blumify_affinity-map_2026-04-10.md
   um die neuen Protokolle: notes/interview_xy_ab.md
   ```

3. Der Agent clustert alle Notizen (bestehende + neue) neu von Grund auf — bestehende Cluster werden bei Bedarf aufgebrochen, gesplittet oder umbenannt. Ein **Changelog** im Output dokumentiert alle Strukturänderungen.

### Was der Agent ausgibt

Die erzeugte Markdown-Datei enthält:

| Abschnitt | Inhalt |
|---|---|
| Frontmatter | Metadaten: Projektname, Datum, verarbeitete Interviews |
| Statistik-Zeile | Notizen gesamt / geclustert / nicht geclustert |
| Changelog *(Modus B)* | Welche Cluster gesplittet, umbenannt oder neu gebildet wurden |
| Grundbedürfnisse | Optionale oberste Ebene nach Hassenzahl (grün) |
| Super Super Header | Übergeordnete Themen (blau) |
| Super Header | Themengruppen (pink) |
| Header | Kleine Notizgruppen (gelb), mit Originaltext der Notizen |
| Nicht geclustert | Alle Notizen ohne Cluster-Zuordnung — transparent ausgewiesen |
| Visualisierung | Mermaid `graph LR` mit farblicher Holtzblatt-Kodierung |

### Cluster-Titel — die wichtigste Qualitätsregel

Alle Cluster-Titel auf Header- und Super-Header-Ebene sind Sätze aus der **Nutzerperspektive**:

- Gut: *"Bei Urlaub bin ich auf andere angewiesen"*
- Schlecht: *"Urlaub"* oder *"Koordinationsproblem"*

Diese Formulierung macht die Insights direkt kommunizierbar — im Team-Meeting, im Design-Brief oder gegenüber Stakeholdern.

### Beispiel-Output

`affinity-mapping/blumify_affinity-map_2026-04-10.md` zeigt eine vollständige Auswertung von 5 Interviews (125 Notizen, 101 geclustert) für das fiktive Produkt *Blumify*.
