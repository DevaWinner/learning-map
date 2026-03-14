# Architecture

## Intent

This codebase uses clean architecture to keep the schedule logic, reporting logic, storage, and UI decoupled. The browser app is the delivery mechanism, not the business model.

## Layers

### Domain

Path: `src/domain`

- Holds stable business entities and shared type contracts.
- Must not import from `application`, `infrastructure`, or `presentation`.
- Contains no storage logic and no browser APIs.

### Application

Path: `src/application`

- Defines ports and use cases.
- Orchestrates domain objects and business workflows.
- Can depend on `domain`.
- Must not import React, `window`, or storage implementations.

### Infrastructure

Path: `src/infrastructure`

- Implements persistence adapters, generated seed data, and utility services.
- Can depend on `application` and `domain`.
- Owns browser-specific details like `localStorage`.

### Presentation

Path: `src/presentation`

- React components, pages, hooks, and styling only.
- `src/presentation/components/ui` contains the shadcn/ui primitive layer used by the rest of the presentation code.
- Can call application use cases through the composition root.
- Must not contain persistence logic or hard-coded roadmap rules.

### Shared UI utilities

Path: `src/lib`

- Contains small shared utilities that support the presentation layer, such as class merging helpers.
- Must not contain business logic or persistence logic.

### Composition root

Path: `src/app`

- Wires repository implementations into the application.
- This is the only place where infrastructure and application are intentionally joined.

## Dependency direction

Allowed flow:

`presentation -> application -> domain`

`infrastructure -> application -> domain`

`presentation -> lib`

`app -> application + infrastructure + presentation`

Disallowed flow:

- `domain -> anything else`
- `application -> presentation`
- `application -> infrastructure implementation`
- `presentation -> infrastructure storage directly`

## Generated data rule

- `src/infrastructure/seeds/roadmap-data.generated.json` is generated from `roadmap.md`.
- Do not hand-edit that file.
- Update the roadmap source, then run `npm run generate:roadmap`.

## State model

- Schedule data is static and generated.
- Sessions, checkpoints, and project focus state are user-owned and persisted locally.
- No network dependency is required for the current app runtime.

## Extension path

- Keep the current browser app local-first.
- If desktop packaging is added later, wrap the same frontend with Tauri instead of rewriting the UI or business logic.
