# StreamJam VSCode Extension

Provides intellisense when developing StreamJam components.

## Features

- Syntax highlighting for @docstrings of Client code
- Svelte warnings and errors

## Requirements

StreamJam Python and Javascript framework.

## Extension Settings

None yet.

## Known Issues

- Syntax highlighting and error reporting for Svelte code may get mixed up with Python code in some places.
- Does not yet recognize component state and method references within Svelte code.

---

## Notes

This extension depends on a fork of Svelte's language-tools repository. Directly invoking Svelte's language server from within this extension would cause the LS to not launch when svelte's extension tries to invoke it. This is caused due to reregistering of commands by the two instances of the server. This fork renames these commands on the server.

Language-tools is added as a git submodule.
- `git submodule add https://github.com/creativesands/language-tools.git`
- `git remote add upstream https://github.com/sveltejs/language-tools.git`
- `git fetch upstream`
- `git checkout main`
- `git merge upstream/main` -or- `git rebase upstream/main`
- `git push origin main`

**Enjoy!**
