# SecureYeoman Community Skills

A community-maintained registry of skills for the [SecureYeoman](https://github.com/MacCracken/secureyeoman) agent platform.

---

## What is a Skill?

A **skill** is a portable JSON file that defines a specialized agent capability — its name, description, instructions, category, and optional tools. Skills are loaded into SecureYeoman's Brain and become available to any personality that installs them.

---

## Skill Format

Each skill is a JSON file conforming to the following structure:

```json
{
  "name": "My Skill",
  "description": "What this skill does (max 2000 chars)",
  "version": "1.0.0",
  "author": "your-github-username",
  "category": "development",
  "tags": ["tag1", "tag2"],
  "instructions": "Detailed instructions for the agent..."
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique, human-readable skill name (max 200 chars) |
| `instructions` | string | Full agent instructions (max 8000 chars) |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `description` | string | `""` | Short description shown in the marketplace (max 2000 chars) |
| `version` | string | `"1.0.0"` | Semantic version |
| `author` | string | `""` | Your name or GitHub username |
| `category` | string | `"general"` | See categories below |
| `tags` | string[] | `[]` | Searchable tags (max 50 chars each) |
| `tools` | Tool[] | `[]` | MCP tool definitions (advanced) |

---

## Categories

| Category | Description |
|----------|-------------|
| `development` | Code review, debugging, architecture, documentation |
| `productivity` | Meeting summaries, task management, writing assistance |
| `security` | Security research, vulnerability analysis, threat modeling |
| `utilities` | Data formatting, conversion, general-purpose helpers |
| `design` | UI/UX review, design critique, accessibility checks |
| `finance` | Financial analysis, budgeting, investment research |
| `science` | Research assistance, data analysis, literature review |
| `general` | Skills that don't fit neatly into another category |

---

## Directory Structure

```
skills/
  development/
    code-reviewer.json
    sql-expert.json
  productivity/
    meeting-summarizer.json
  security/
    security-researcher.json
  utilities/
    data-formatter.json
```

Skills **must** live under `skills/<category>/<skill-name>.json`. The category in the path and the `category` field in the JSON should match.

---

## JSON Schema

A formal JSON Schema for skill validation lives at [`schema/skill.schema.json`](schema/skill.schema.json). You can use it in your editor for inline validation:

```json
{
  "$schema": "../schema/skill.schema.json"
}
```

---

## Installation

### Option 1: Clone this repo and sync

```bash
# Clone alongside your secureyeoman install
git clone https://github.com/MacCracken/secureyeoman-community-skills.git ../secureyeoman-community-skills

# Sync skills into SecureYeoman
POST /api/v1/marketplace/community/sync
```

### Option 2: Point to any local path

SecureYeoman's community sync accepts **any local directory** that follows the `skills/<category>/<name>.json` structure — not just this repo. Fork it, maintain your own collection, or mix both.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guide.

The short version:
1. Fork this repo
2. Add your skill under `skills/<category>/<name>.json`
3. Validate against `schema/skill.schema.json`
4. Open a pull request

---

## Disclaimer

Community skills are contributed by independent authors and are **not reviewed, endorsed, or warranted** by the SecureYeoman project or its maintainers.

**Liability rests entirely with the user.** By installing and using community skills you accept full responsibility for:
- The actions the agent takes while operating under a skill's instructions
- Any security, legal, or operational consequences of using the skill
- Verifying that skill instructions are appropriate for your environment before deploying them in production

Security-oriented skills (e.g., `security-researcher`) are intended for **authorized defensive use only**. Using them against systems you do not own or have explicit written permission to test may violate local laws. The SecureYeoman project and skill authors bear no liability for unauthorized or illegal use.

**Always review skill instructions before installing them.**

---

## Revisiting the Marketplace Approach

The current sync model is intentionally simple: clone locally, sync on demand, no network calls from the agent core. This keeps it secure, offline-capable, and flexible. The community's real-world usage will guide what comes next — see [Phase 22 in the SecureYeoman roadmap](https://github.com/MacCracken/secureyeoman/blob/main/docs/development/roadmap.md) for planned evolutions (git URL fetch, hosted discovery, etc.).
