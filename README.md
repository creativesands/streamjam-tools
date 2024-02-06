# streamjam-tools README

This is the README for your extension "streamjam-tools". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [A guide to writing a language grammar (TextMate)](https://gist.github.com/Aerijo/b8c82d647db783187804e86fa0a604a1)
* [Writing a TextMate Grammar](https://www.apeth.com/nonblog/stories/textmatebundle.html)

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
