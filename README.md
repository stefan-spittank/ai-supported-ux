# AI-Supported UX Research 

Dieses Repository enthält Claude Code Agenten, die einen KI-unterstützten UX-Research-Prozess abbilden. Die Agenten übernehmen methodisch anspruchsvolle Auswertungsschritte, die im klassischen Prozess manuell und zeitintensiv sind — und geben dem Team mehr Kapazität für Interpretation, Design-Entscheidungen und Validation.

Die Agenten sind keine Blackboxen: Jede Entscheidung ist im Output nachvollziehbar und kann vom Team hinterfragt oder revidiert werden.

## Verzeichnisstruktur

```
interviews/
├── .claude/
│   └── agents/
│       ├── affinity-mapping.md    # Agent-Definition
│       └── persona-creation.md   # Agent-Definition
├── notes/                         # Rohdaten: Interview-Protokolle
│   └── interview_[kürzel].md
├── affinity-mapping/              # Output: Affinity Maps
│   └── [projekt]_affinity-map_[datum].md
├── personas/                      # Output: Persona-Artefakte
│   ├── [projekt]_01_persona-variables_[datum].md
│   ├── [projekt]_02_persona-mapping_[datum].md
│   └── [projekt]_03_personas_[datum].md
└── README.md
```

## Agenten

### 1. `affinity-mapping` — Holtzblatt Affinity Mapping

Wertet Nutzerinterviews nach der [Affinity Mapping Methode von Karen Holtzblatt](https://en.wikipedia.org/wiki/Affinity_diagram) aus. Der Agent liest beliebig viele Interview-Protokolle, clustert alle Notizen in eine vierstufige Hierarchie und ordnet die Cluster optional den psychologischen Grundbedürfnissen nach [Marc Hassenzahl](https://hassenzahl.wordpress.com/) zu.

**Anleitung → siehe unten**

### 2. `persona-creation` — UX Personas nach Cooper / Goodwin

Erstellt datengetriebene UX Personas aus Interview-Protokollen und einer optionalen Affinity Map. Die Methode basiert auf Kim Goodwins Ansatz aus *"Designing for the Digital Age"* und Alan Coopers Persona-Framework. Der Agent arbeitet in drei moderierten Schritten und holt nach jedem Schritt aktiv Feedback ein — die Zwischenergebnisse sind als Artefakte gespeichert und können vor der Weiterverarbeitung geprüft und angepasst werden.

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

---

## Anleitung: `persona-creation`

### Voraussetzungen

- [Claude Code](https://claude.ai/code) ist installiert und im Repository-Verzeichnis geöffnet
- Interview-Protokolle liegen als Markdown-Dateien unter `notes/` vor (gleiches Format wie für `affinity-mapping`)
- Eine Affinity Map unter `affinity-mapping/` ist empfohlen, aber nicht zwingend

### Aufruf

```
/agent persona-creation
```

Der Agent fragt nach den Interview-Protokollen und der optionalen Affinity Map. Dann startet er den dreistufigen Prozess und holt nach jedem Schritt Feedback ein.

### Die drei Schritte

Der Agent arbeitet in drei Schritten und pausiert nach jedem für Feedback. Erst nach Bestätigung (oder nach dem Umsetzen von Änderungen) geht er weiter.

**Schritt 1 — Verhaltens- und Einstellungsvariablen**

Der Agent leitet aus den Rohdaten 6–12 Variablen ab, die echte Unterschiede zwischen den Interviewten beschreiben. Jede Variable hat zwei klar benannte Pole und eine variable-spezifische Skala (binär, 3- oder 5-stufig, je nach Natur der Variable).

Output: `affinity-mapping/personas/[projekt]_01_persona-variables_[datum].md`

**Schritt 2 — Mapping und Cluster**

Der Agent verortet jeden Interviewten auf jeder Variable und sucht nach Clustern ähnlicher Profile. Unklare Zuordnungen werden nicht in eine Default-Mitte gesetzt: Tendenzen werden als Annahmen markiert (`*`), echte Unklarheiten als `?` ausgewiesen und im Abschnitt "Nicht zuordenbar" erläutert — mit Empfehlung, ob beim Interviewten nachgefasst werden sollte.

Output: `affinity-mapping/personas/[projekt]_02_persona-mapping_[datum].md`

**Schritt 3 — Personas**

Aus jedem Cluster entsteht eine Primary oder Secondary Persona mit Name, demografischer Skizze, Zitat, Verhaltenscluster-Tabelle, Zielen auf drei Ebenen und Frustrations & Pain Points. Der Agent führt eine Qualitätsprüfung durch.

Output: `affinity-mapping/personas/[projekt]_03_personas_[datum].md`

### Die drei Ziel-Ebenen nach Cooper

Eine gute Persona hat klar ausgearbeitete Ziele auf drei Ebenen:

| Ebene | Frage | Beispiel |
|---|---|---|
| **Moto-Goals** | Warum? Tiefe Motivation | *"Ich will nicht die Person sein, die immer Pflanzen tötet"* |
| **Do-Goals** | Was? Konkrete Aufgaben | *"Auf einen Blick sehen, welche Pflanzen heute Wasser brauchen"* |
| **Be-Goals** | Wie? Gewünschte Selbstwahrnehmung | *"Ich will mich als jemanden fühlen, der die Dinge im Griff hat"* |

### Was der Agent ausgibt

| Artefakt | Datei | Inhalt |
|---|---|---|
| Variablen | `_01_persona-variables_` | 6–12 Variablen mit Polbeschreibung, Skala und Evidenz aus den Rohdaten |
| Mapping | `_02_persona-mapping_` | Pol-Tabelle, Variablen-Matrix, Cluster-Vorschläge, Abschnitt "Nicht zuordenbar" |
| Personas | `_03_personas_` | Primary und Secondary Personas mit Zielen, Pain Points, Kontext und Qualitätsprüfung |

### Beispiel-Output

`affinity-mapping/personas/blumify_01_persona-variables_2026-04-10.md`, `_02_persona-mapping_` und `_03_personas_` zeigen eine vollständige Persona-Erstellung aus 5 Blumify-Interviews mit 3 Personas (1 Primary, 2 Secondary).
