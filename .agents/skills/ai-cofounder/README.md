# AI Co-Founder Skill

A cross-platform AI skill that guides founders through a structured discovery process — from raw self-knowledge to validated business directions and startup artifacts. Works with Claude (Tool Use), OpenAI/GPT (Function Calling), and Gemini (CLI Skills).

## What It Does

The skill runs a 13-step Founder Discovery Flow organized into 5 phases:

| Phase | Steps | What Happens |
|-------|-------|--------------|
| Elicitation | 1-4 | Collect skills, interests, experience, constraints |
| Inference | 5-8 | Derive customer segments, problems, value proposition, business models |
| Synthesis | 9-11 | Generate business directions, evaluate and stress-test the chosen one |
| Assessment | 12 | Analyze technical feasibility; optionally refer to a technical co-founder |
| Artifacts | 13 | Generate landing page, pitch deck, elevator pitch, competitive analysis, financial sketch |

The agent asks one question at a time, confirms each step with the founder, and passes structured data forward through the pipeline. Founders can backtrack to any earlier step at any time.

## Installation

### Claude (Claude Code)

Copy the command file into your project:

```bash
mkdir -p .claude/commands
cp .claude/commands/cofounder.md YOUR_PROJECT/.claude/commands/
```

Then invoke with `/cofounder` in Claude Code.

Alternatively, use the skill directly — the `SKILL.md` file is a standalone Claude Code skill definition.

### OpenAI / GPT

Load the function definitions and system prompt into your assistant or API call:

- **Functions**: `dist/openai/functions.json` — 17 function definitions with `strict: true`
- **System prompt**: `dist/openai/agent_prompt.txt` — full agent instructions
- **Config** (optional): `dist/openai/agent_config.json`

```python
import json

with open("dist/openai/functions.json") as f:
    tools = json.load(f)

with open("dist/openai/agent_prompt.txt") as f:
    system_prompt = f.read()

# Pass tools and system_prompt to the OpenAI API
```

### Gemini CLI

Install the skill from the Gemini dist directory:

```bash
gemini skills install /path/to/ai-cofounder-skill/dist/gemini
```

The Gemini skill uses a dedicated `SKILL.md` (`dist/gemini/SKILL.md`) that performs all analysis conversationally without function calls — Gemini CLI skills don't support tool invocation, so the agent reasons inline instead of calling external functions.

Additional Gemini files (for custom API integrations, not the CLI):

- `dist/gemini/skills.yaml` — 17 skill schemas (input + output)
- `dist/gemini/workflow.yaml` — 5-phase, 13-step workflow definition
- `dist/gemini/agent_prompt.txt` — agent instructions (plain text, markdown stripped)

## Usage

### Claude Code

Type `/cofounder` in any Claude Code session where the command file is installed. The agent will open with a greeting and ask about your skills.

You can also trigger the skill naturally by telling Claude something like "I want to figure out what kind of business to start" or "Help me validate a startup idea" — the `SKILL.md` description tells Claude when to activate.

### OpenAI / GPT

Once the functions and system prompt are loaded, start a conversation. The agent responds to any founder-discovery intent. Example opening messages:

- "I want to explore startup ideas based on my background."
- "I'm a data scientist with 10 years in healthcare. What should I build?"
- "Help me figure out what kind of business I should start."

The agent will call the 17 functions in sequence as the conversation progresses. Your application handles the function calls and returns structured JSON matching each function's schema.

### Gemini CLI

After installation, the skill activates automatically when Gemini detects a matching intent. Start a conversation:

```
gemini
> I want to figure out what kind of business to start.
```

The agent works through all 13 steps conversationally, performing analysis inline rather than via function calls.

## Project Structure

```
ai-cofounder-skill/
  SKILL.md                    # Claude Code skill definition
  agent-prompt.md             # Source agent prompt (all platforms)
  capability-map.json         # Skill graph with categories and data flow
  flow-description.md         # Detailed 13-step flow specification

  schemas/
    src/
      shared_types.json       # 13 shared type definitions
      *.json                  # 16 source schemas (cross-file $ref)
    *.json                    # 17 built schemas (self-contained)

  scripts/
    build-schemas.js          # Resolves $ref, produces self-contained schemas

  dist/
    openai/
      functions.json          # Function definitions (strict: true)
      agent_prompt.txt         # System prompt
      agent_config.json       # Optional config
    anthropic/
      tools.json              # Tool definitions
      agent_prompt.txt         # System prompt
      agent_config.json       # Optional config
    gemini/
      SKILL.md                # Gemini CLI skill (conversational, no function calls)
      skills.yaml             # Skill schemas (for custom API integrations)
      workflow.yaml           # Phase/step workflow (for custom API integrations)
      agent_prompt.txt        # System prompt (plain text)

  .claude/commands/
    cofounder.md              # Claude Code slash command
```

## Build Pipeline

Source schemas in `schemas/src/` use cross-file `$ref` to reference shared types from `shared_types.json`. The build script resolves these into self-contained schemas:

```bash
node scripts/build-schemas.js
```

This produces 17 JSON files in `schemas/` — each with all referenced types copied into its own `$defs` section. The vendor manifests in `dist/` are compiled from these built schemas.

Build flow: `schemas/src/*.json` + `shared_types.json` -> `scripts/build-schemas.js` -> `schemas/*.json` -> vendor compile -> `dist/`

## 17 Tools

| # | Tool | Phase |
|---|------|-------|
| 1 | `collect_skills` | Elicitation |
| 2 | `collect_interests` | Elicitation |
| 3 | `collect_experience` | Elicitation |
| 4 | `collect_constraints` | Elicitation |
| 5 | `infer_customer_segments` | Inference |
| 6 | `infer_problem_statements` | Inference |
| 7 | `infer_value_proposition` | Inference |
| 8 | `infer_business_models` | Inference |
| 9 | `generate_business_directions` | Synthesis |
| 10 | `evaluate_direction` | Synthesis |
| 11 | `evaluate_project` | Synthesis |
| 12 | `assess_technical_needs` | Assessment |
| 13 | `artifact_landing_page` | Artifacts |
| 14 | `artifact_pitch_deck` | Artifacts |
| 15 | `artifact_elevator_pitch` | Artifacts |
| 16 | `artifact_competitive_analysis` | Artifacts |
| 17 | `artifact_financial_sketch` | Artifacts |

## License

See LICENSE file for details.
