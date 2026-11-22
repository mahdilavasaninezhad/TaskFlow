# TaskFlow

TaskFlow is a bilingual React and TypeScript portfolio project that demonstrates Kanban management, task editing, workflow analytics, persistent preferences, and drag-and-drop interaction.

## Features

- Kanban with four workflow stages and drag-and-drop between stages
- Board, list and insights views
- Three sample project workspaces and five demo team members
- Create, edit, duplicate and remove tasks
- Search, priority, assignee and category filters
- English/Farsi switching, RTL/LTR and Persian calendar display
- Light/dark themes with saved preferences
- Demo data stored locally in the browser
- JSON export of local demo tasks
- Responsive layout, command search with Ctrl/Cmd + K and Escape-to-close for task dialogs

## Development

Install dependencies with `npm install`, then start the dev server with `npm run dev`. Use `npm run build` for a production bundle.

The application uses browser localStorage and sample data. It has no backend, real authentication, multiuser synchronization or external API integration. Exporting JSON creates a local file and does not transmit data to a server.

## GitHub Pages

This project is configured for a repository named `TaskFlow` under `https://USERNAME.github.io/TaskFlow/`. The Vite base path in `vite.config.ts` is `/TaskFlow/`. Create an independent public repository with that exact name and push to the `main` branch. In repository Settings > Pages select GitHub Actions as the source.

The workflow installs packages in GitHub Actions. Commit `package-lock.json` after installing locally if you want reproducible dependency versions. If you use a different repository name, change the Vite base path to match.

## Portfolio context

This is a frontend demonstration. Screens, charts and metrics are calculated from the local task dataset. Interface translations do not automatically translate user-entered text.
