# Repository Guidelines

## Project Structure & Module Organization
This repository is a GitBook-style documentation set. The landing page is `README.md`, and the table of contents lives in `SUMMARY.md`. Primary content lives under `fdo-manuale-operativo/`, `federal-investigation-bureau/`, and `utilizzo-mdt/`. Subsections for operational units are in `fdo-manuale-operativo/reparti-operativi/`. Images and cover assets are stored in `.gitbook/assets/` and referenced from YAML frontmatter blocks at the top of each page.

## Build, Test, and Development Commands
No build, test, or dev scripts are defined in this repository. Use your editor’s Markdown preview for local review. When adding or moving pages, update `SUMMARY.md` so the GitBook navigation stays in sync (example entry: `* [4️⃣ Codici e Ten-Code](fdo-manuale-operativo/codici-e-ten-code.md)`).

## Coding Style & Naming Conventions
Pages are Markdown with YAML frontmatter (`---` block) that should remain at the top of the file. Headings frequently include numbered or emoji prefixes; follow the established pattern in the surrounding section. Filenames and directories use kebab-case Italian names (example: `fdo-manuale-operativo/procedure-operative-base.md`). Keep tone and terminology consistent with existing pages.

## Testing Guidelines
There are no automated tests. Validate changes manually by:
- Checking that new files appear in `SUMMARY.md`.
- Verifying relative links and image paths resolve.
- Previewing pages to confirm headings and frontmatter render correctly.

## Commit & Pull Request Guidelines
The Git history is minimal; one commit uses a ticket-style prefix. Use short, descriptive commit messages, and include a ticket ID if your workflow requires it (example: `GITBOOK-24: Update gerarchia`). Pull requests should include a brief summary, a list of pages updated, and any external links added or changed.

## Content Update Checklist
- Add or edit Markdown pages in the appropriate section directory.
- Keep YAML frontmatter intact and update `SUMMARY.md` for navigation.
- Re-check affected pages in a Markdown preview before requesting review.
