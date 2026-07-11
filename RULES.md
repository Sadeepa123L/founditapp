## Git Commit Guidelines

When making commits, you MUST strictly follow the "Conventional Commits" standard.

**Format:**
`<type>(<optional scope>): <description>`

**Allowed Types:**

- **feat:** Adds a new feature to the application.
- **fix:** Fixes a bug.
- **chore:** Changes to the build process, auxiliary tools, or configurations (e.g., updating .gitignore, modifying config files).
- **refactor:** Code changes that neither fix a bug nor add a feature.
- **docs:** Documentation changes only.
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, etc.).

**Examples:**

- `feat(auth): add user login functionality`
- `fix(ui): resolve button alignment issue on mobile`
- `chore: update .gitignore to include .env files`

**Rules:**

1. Keep the description short and in the present tense (e.g., "add feature" not "added feature").
2. No uppercase letters at the beginning of the description.
3. No periods at the end of the commit message.
4. Do not commite and push my custom .md files.
