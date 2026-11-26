# Copilot instructions

Project context Copilot should apply to every session in this repository.

## Stack

- Framework: Astro (static output).
- Language: TypeScript.
- Styling: plain CSS in the base layout.

## Conventions

- Keep components small and focused.
- Prefer semantic HTML and accessible markup.
- Do not close, or add closing keywords for, the exercise walkthrough issue (issue #1) in any pull request. The exercise's GitHub Actions workflows manage that issue. When you open a pull request for app work, link only the specific app work-item issue you are implementing.

## Persistence and hydration rules

- Persist bookmarks in browser `localStorage`, including each bookmark's original URL and locally generated short slug.
- Use Astro's `client:load` directive for interactive framework components that need hydration immediately on page load. Client directives apply to framework components, not `.astro` components.
- Put browser-only behavior in `.astro` component `<script>` blocks, which run in the browser without a hydration directive. Never access browser APIs from Astro frontmatter or other code that runs during the static build.
