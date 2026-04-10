# AI-Supported UX Research

This repository contains Claude Code agents that implement an AI-supported UX research process. The agents handle methodologically demanding analysis steps that are manual and time-intensive in the classic process — giving the team more capacity for interpretation, design decisions, and validation.

The agents are not black boxes: every decision is traceable in the output and can be questioned or revised by the team.

## Directory Structure

```
interviews/
├── .claude/
│   └── agents/
│       ├── affinity-mapping.md    # Agent definition
│       └── persona-creation.md   # Agent definition
├── notes/                         # Raw data: interview protocols
│   └── interview_[label].md
├── affinity-mapping/              # Output: Affinity Maps
│   └── [project]_affinity-map_[date].md
├── personas/                      # Output: Persona artifacts
│   ├── [project]_01_persona-variables_[date].md
│   ├── [project]_02_persona-mapping_[date].md
│   └── [project]_03_personas_[date].md
└── README.md
```

## Agents

### 1. `affinity-mapping` — Holtzblatt Affinity Mapping

Evaluates user interviews according to the [Affinity Mapping method by Karen Holtzblatt](https://en.wikipedia.org/wiki/Affinity_diagram). The agent reads any number of interview protocols, clusters all notes into a four-level hierarchy, and optionally maps the clusters to psychological needs according to [Marc Hassenzahl](https://hassenzahl.wordpress.com/).

**Instructions → see below**

### 2. `persona-creation` — UX Personas according to Cooper / Goodwin

Creates data-driven UX Personas from interview protocols and an optional Affinity Map. The method is based on Kim Goodwin's approach from *"Designing for the Digital Age"* and Alan Cooper's persona framework. The agent works in three moderated steps and actively requests feedback after each step — the intermediate results are saved as artifacts and can be reviewed and adjusted before further processing.

**Instructions → see below**

---

## Instructions: `affinity-mapping`

### Prerequisites

- [Claude Code](https://claude.ai/code) is installed and opened in the repository directory
- Interview protocols are available as Markdown files with YAML frontmatter under `notes/`

### Format of Interview Protocols

Each protocol file requires a YAML frontmatter and numbered lines as raw data:

```markdown
---
title: "User interview: Project name"
short label: "label"
date: 2026-04-01
interviewer: "Name"
interviewee: "Name"
minute taker: "Name"
method: "Semi-structured interview"
length: 45
status: "raw data"
---

1. First observation from the interview
2. Second observation
3. ...
```

Each numbered line is treated as an independent note. The wording is never changed by the agent.

### Mode A — Create new Affinity Map

1. Open Claude Code and call the agent:

   ```
   /agent affinity-mapping
   ```

2. The agent asks for the protocol files. Provide the paths, e.g.:

   ```
   notes/interview_fh_hg.md
   notes/interview_mh_je.md
   notes/interview_dw_am.md
   ```

3. The agent creates the Affinity Map and writes it to `affinity-mapping/[projectname]_affinity-map_[date].md`.

### Mode B — Extend existing Affinity Map

1. Call the agent and specify Mode B:

   ```
   /agent affinity-mapping
   ```

2. Tell the agent which existing map should be extended and which new protocols are being added:

   ```
   Extend affinity-mapping/blumify_affinity-map_2026-04-10.md
   with the new protocols: notes/interview_xy_ab.md
   ```

3. The agent re-clusters all notes (existing + new) from scratch — existing clusters may be broken up, split, or renamed as needed. A **changelog** in the output documents all structural changes.

### What the Agent Outputs

The generated Markdown file contains:

| Section | Content |
|---|---|
| Frontmatter | Metadata: project name, date, processed interviews |
| Statistics line | Total notes / clustered / unclustered |
| Changelog *(Mode B)* | Which clusters were split, renamed, or newly created |
| Needs | Optional top level according to Hassenzahl (green) |
| Super Super Header | Top-level themes (blue) |
| Super Header | Theme groups (pink) |
| Header | Small note groups (yellow), with original note text |
| Unclustered | All notes without cluster assignment — transparently documented |
| Visualization | Mermaid `graph LR` with Holtzblatt color coding |

### Cluster Titles — the Most Important Quality Rule

All cluster titles at the Header and Super Header level are sentences from the **user's perspective**:

- Good: *"When I'm away, I depend on others"*
- Bad: *"Vacation"* or *"Coordination problem"*

This phrasing makes insights directly communicable — in team meetings, in design briefs, or with stakeholders.

### Example Output

`affinity-mapping/blumify_affinity-map_2026-04-10.md` shows a complete evaluation of 5 interviews (125 notes, 101 clustered) for the fictional product *Blumify*.

---

## Instructions: `persona-creation`

### Prerequisites

- [Claude Code](https://claude.ai/code) is installed and opened in the repository directory
- Interview protocols are available as Markdown files under `notes/` (same format as for `affinity-mapping`)
- An Affinity Map under `affinity-mapping/` is recommended but not required

### Invocation

```
/agent persona-creation
```

The agent asks for the interview protocols and the optional Affinity Map. Then it starts the three-step process and requests feedback after each step.

### The Three Steps

The agent works in three steps and pauses after each for feedback. Only after confirmation (or after implementing requested changes) does it proceed.

**Step 1 — Behavioral and Attitudinal Variables**

The agent derives 6–12 variables from the raw data that describe real differences between interviewees. Each variable has two clearly named poles and a variable-specific scale (binary, 3-level, or 5-level, depending on the nature of the variable).

Output: `personas/[project]_01_persona-variables_[date].md`

**Step 2 — Mapping and Clusters**

The agent positions each interviewee on each variable and looks for clusters of similar profiles. Unclear assignments are never placed in a default middle: tendencies are marked as assumptions (`*`), genuine ambiguities are documented as `?` and explained in the "Not Assignable" section — with a recommendation on whether to follow up with the interviewee.

Output: `personas/[project]_02_persona-mapping_[date].md`

**Step 3 — Personas**

From each cluster, one Primary or Secondary Persona is created with name, demographic sketch, quote, behavior cluster table, goals at three levels, and Frustrations & Pain Points. The agent conducts a quality check.

Output: `personas/[project]_03_personas_[date].md`

### The Three Goal Levels according to Cooper

A good persona has clearly developed goals at three levels:

| Level | Question | Example |
|---|---|---|
| **Moto-Goals** | Why? Deep motivation | *"I don't want to be the person who always kills plants"* |
| **Do-Goals** | What? Concrete tasks | *"See at a glance which plants need water today"* |
| **Be-Goals** | How? Desired self-perception | *"I want to feel like someone who has things under control"* |

### What the Agent Outputs

| Artifact | File | Content |
|---|---|---|
| Variables | `_01_persona-variables_` | 6–12 variables with pole description, scale, and evidence from the raw data |
| Mapping | `_02_persona-mapping_` | Pole table, variable matrix, cluster suggestions, "Not Assignable" section |
| Personas | `_03_personas_` | Primary and Secondary Personas with goals, pain points, context, and quality check |

### Example Output

`personas/blumify_01_persona-variables_2026-04-10.md`, `_02_persona-mapping_`, and `_03_personas_` show a complete persona creation from 5 Blumify interviews with 3 personas (1 Primary, 2 Secondary). Note: the example files are in German as they were created during the initial development of this repository.
