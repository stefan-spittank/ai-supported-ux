# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A set of Claude Code sub-agents that automate methodologically rigorous UX research — from interview preparation through analysis to product planning. There is no build system, test runner, or dev server — the "product" is the agent definitions in `.claude/agents/`.

## Invoking the Agents

Run these from within a Claude Code session:

```
/agent contextual-inquiry  # Interview the developer, generate a Contextual Inquiry guide
/agent affinity-mapping    # Cluster interview notes into a hierarchical Affinity Map
/agent persona-creation    # Derive behavioral variables and personas from interview data
/agent story-mapping       # Build a release-sliced User Story Map from all research artifacts
```

Agents are designed to be run from `ux-research/interviews/` where the data lives.

## Architecture

Four agents cover the full UX research pipeline — from interview preparation to product planning:

```
contextual-inquiry agent            → ux-research/interviews/[project]_interview-guide_[date].md
        ↓
    (researcher conducts interviews with real users)
        ↓
ux-research/interviews/notes/*.md   ← raw interview protocols (Markdown + YAML frontmatter)
        ↓
affinity-mapping agent              → ux-research/interviews/affinity-mapping/*.md
        ↓
persona-creation agent              → ux-research/interviews/personas/*.md (3 files)
        ↓
story-mapping agent                 → ux-research/interviews/story-map/*.md
```

**contextual-inquiry** (`.claude/agents/contextual-inquiry.md`): Prepares Contextual Inquiry field studies (Beyer & Holtzblatt). Two-phase process: (1) structured domain interview with the developer/stakeholder to understand the product, workflows, pain points, and terminology, (2) synthesis into a tailored CI guide with observation triggers, probe questions, hypotheses checklist, and a notes template matching the project's protocol format. Designed to run before any user interviews.

**affinity-mapping** (`.claude/agents/affinity-mapping.md`): Implements Karen Holtzblatt's Affinity Mapping method. Clusters individual interview notes bottom-up into 4–5 hierarchy levels. Supports two modes: create a new map (Mode A) or extend an existing one with new interviews (Mode B, re-clusters everything from scratch). Notes are never rephrased — verbatim wording with source attribution is a hard requirement. Outputs a Mermaid graph visualization alongside the clustered structure.

**persona-creation** (`.claude/agents/persona-creation.md`): Implements Kim Goodwin/Alan Cooper personas. Three-step moderated process with user sign-off after each step: (1) derive 6–12 behavioral/attitudinal variables, (2) position interviewees on variables and identify clusters, (3) write Primary and Secondary Personas with three-level goals (Moto/Do/Be). Takes interview protocols + optional Affinity Map as input.

**story-mapping** (`.claude/agents/story-mapping.md`): Implements Jeff Patton's User Story Mapping. Six-phase moderated process: (1) load artifacts, (2) frame scope/persona/outcome, (3) draft and confirm activities (backbone top row), (4) draft and confirm tasks (walking skeleton), (5) explore stories below the backbone, (6) slice into releases. Takes all prior research artifacts as input and writes a single story map artifact with a Research Traceability section linking the map back to the raw data.

## Interview Protocol Format

Interview files must follow this structure for agents to parse them correctly:

```markdown
---
id: interview_xx_xx
date: YYYY-MM-DD
interviewer: Name
participant: Pseudonym
project: ProjectName
---

# Interview Notes

1. Note text here
2. Another note
```

Notes are numbered and must not be rephrased when referenced in outputs.

## Output Naming Convention

Artifacts are named `{project}_{artifact-type}_{date}.md`, e.g.:
- `blumify_interview-guide_2026-04-08.md` (contextual-inquiry agent output → directly in `interviews/`)
- `blumify_affinity-map_2026-04-10.md`
- `blumify_01_persona-variables_2026-04-10.md`
- `blumify_02_persona-mapping_2026-04-10.md`
- `blumify_03_personas_2026-04-10.md`
- `blumify_story-map_2026-04-17.md` (story-mapping agent output → `story-map/` subdirectory)

The persona artifacts are prefixed `01_`, `02_`, `03_` to reflect their sequential dependency.

## Permissions

The agents require specific permissions that are pre-configured in `ux-research/interviews/.claude/settings.local.json`: file rename operations and `WebFetch` access to academic/methodology reference sites (Hassenzahl, IxDF, APA, etc.) used when citing or verifying UX methodology.

## Reference Data

`ux-research/interviews/` contains a complete worked example (Blumify — fictional plant care app) with 5 German-language interview protocols, a full affinity map, and all three persona artifacts. Use this as ground truth when modifying agent behavior.
