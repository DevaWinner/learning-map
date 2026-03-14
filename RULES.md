# Engineering Rules

## 1. Product intent

- Build for reliability and weekly execution clarity, not feature sprawl.
- Favor local-first workflows over server complexity unless multi-device sync is an explicit requirement.
- Every feature must help one of these jobs: see the week, log the work, report the week, or protect focus.

## 2. Architecture rules

- Enforce clean architecture boundaries from [docs/ARCHITECTURE.md](/home/devwinner/workspace/personal/learning/docs/ARCHITECTURE.md).
- Keep business logic in `domain` and `application`, not in React components.
- Infrastructure must implement ports; presentation must never reach into persistence directly.
- Composition happens in `src/app` only.
- Generated files must stay generated. Do not manually edit `src/infrastructure/seeds/roadmap-data.generated.json`.

## 3. Engineering principles

- Prefer simplicity over abstraction count.
- Favor deterministic behavior over clever behavior.
- Make state transitions explicit.
- Keep data models stable and serializable.
- Every non-trivial change must leave the codebase easier to reason about than before.
- Avoid hidden coupling between the roadmap source, UI state, and persistence shape.

## 4. Coding standards

- Language: TypeScript only for app code.
- Module style: ESM only.
- Strictness: keep TypeScript strict mode enabled.
- File size target: prefer files under 250 lines unless separation would reduce clarity.
- Naming:
  - `PascalCase` for React components and interfaces that represent named concepts.
  - `camelCase` for functions, hooks, and variables.
  - `kebab-case` for file names unless the file exports a React component.
- Functions should do one job and expose stable inputs and outputs.
- Avoid boolean argument traps. Use objects when a function needs more than two meaningful inputs.
- Comments must explain intent or non-obvious tradeoffs, never restate syntax.
- Default to ASCII in source files unless the source data already requires otherwise.

## 5. React and UI rules

- Components render UI; hooks coordinate UI state; use cases hold workflow logic.
- Prefer the shadcn/ui primitive layer for buttons, cards, inputs, tabs, popovers, and other repeated interface patterns.
- Keep forms controlled and explicit.
- Prefer composition over prop drilling through many intermediate layers.
- Derive display values from domain data instead of duplicating state.
- Avoid unnecessary memoization. Add it only when profiling or clear rerender pressure justifies it.
- Preserve local-first usability: the app should remain useful without a network connection.
- Treat export, save, and delete actions as user-visible operations with clear feedback.

## 6. Persistence rules

- All browser persistence must go through infrastructure repositories.
- Persist only serializable domain data.
- Use versionable storage keys with a single owner per aggregate.
- Corrupt local data must fail soft and fall back safely.
- Do not mix generated roadmap data with mutable user progress state.

## 7. Error-handling rules

- Fail fast inside development workflows.
- Fail soft in user flows where local recovery is possible.
- Surface user-facing errors in plain language.
- Never swallow exceptions without a fallback reason.
- Keep guardrails around date parsing, local storage reads, and missing generated data.

## 8. Testing rules

- Test domain logic before UI details.
- Prioritize unit coverage for schedule math, weekly summary generation, and markdown export.
- Add integration tests for repository adapters when persistence behavior grows more complex.
- UI tests should focus on critical flows: logging a session, saving a checkpoint, exporting a report.
- Every bug fix should add or update a test when the failure mode is repeatable.

## 9. Documentation rules

- Keep `README.md` accurate enough for a clean checkout to run the project.
- Update `docs/ARCHITECTURE.md` when changing boundaries, composition, or major folder responsibilities.
- Update `RULES.md` when team conventions or delivery constraints change.
- Document generated files and regeneration commands next to the owning script.
- Prefer short, durable docs over long speculative docs.

## 10. Git and change-management rules

- Keep commits cohesive and scoped to one change theme.
- Do not mix generated-file changes with unrelated refactors unless the generator itself changed.
- Review diffs for architecture boundary leaks before commit.
- Never rewrite user-owned progress data formats without documenting migration intent.

## 11. Task management rules

- The source of planned delivery phases is [tasks.json](/home/devwinner/workspace/personal/learning/tasks.json).
- Keep the active work inside the current phase unless a blocker requires pulling forward a dependency.
- Each task must have acceptance criteria that can be verified locally.
- Close tasks only when code, docs, and verification all match the intended outcome.

## 12. Definition of done

A feature is not done until:

- The code respects layer boundaries.
- The intended user flow works locally.
- The relevant docs are updated.
- Generated files are regenerated if their source changed.
- Local verification has been run or a concrete reason is recorded for why it could not be run.
