---
name: skill-registry
description: >
  Compact rules resolved per-delegation from skill registry.
  See ~/.config/opencode/skills/skill-registry/SKILL.md for format details.
---

# Skill Registry - Parcial 1 Gestion de turnos

## Project Conventions

- **CLAUDE.md**: Bun-first conventions (bun test, bun run, bun install)
- **AGENTS.md**: Spanish (Rioplatense) tone, senior architect persona

## User Skills (auto-resolved by context)

| Context Trigger | Skill | Compact Rules |
|-----------------|-------|---------------|
| Go tests, Bubbletea TUI | go-testing | Skip (not applicable) |
| Creating new AI skills | skill-creator | Skip (not applicable) |

## SDD Skills

| Phase | Skill | Compact Rules |
|-------|-------|---------------|
| sdd-init | sdd-init | Initialize SDD context |
| sdd-explore | sdd-explore | Explore ideas before committing |
| sdd-propose | sdd-propose | Create change proposals |
| sdd-spec | sdd-spec | Write specifications |
| sdd-design | sdd-design | Create technical design |
| sdd-tasks | sdd-tasks | Break down into tasks |
| sdd-apply | sdd-apply | Implement code |
| sdd-verify | sdd-verify | Validate against specs |
| sdd-archive | sdd-archive | Archive completed changes |

## Code Patterns (auto-injected for relevant code contexts)

### Bun + React + Tailwind

```typescript
// Server with Bun.serve()
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

### React Component

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

### shadcn/ui + Tailwind class merging

```tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cva } from "class-variance-authority"
```

## Architecture

- SPA con React Router v7
- Client-side routing
- Radix UI primitives para accesibilidad
- Tailwind CSS v4 + bun-plugin-tailwind
- Dexie para IndexedDB (client-side DB)
