---
title: "Automating PR Fixes with Antigravity"
date: "2026-03-16"
summary: "Leverage Agent Skills to automate code changes for addressing review comments"
---

You have implemented a new feature and created a PR, the review comments start to roll-in. Whether those review comments come from an automated AI assistant like Gemini Code Assist or a human collaborator, manually jumping between GitHub and your IDE to apply every suggestion is a major friction point. It often involves tedious copy-pasting and constant switching between windows.

You can close this loop by using Antigravity to automatically interpret and apply those suggested changes directly to your local source code. Here is how to set up that seamless workflow.

### 1. Configure the Antigravity Skill

Just create .agents/skills/address-pr-comments/SKILL.md file in your Antigravity workspace. Often this is just your repository folder. Add the following content to your SKILL.md file. 



```markdown
---
name: Fetch the review comments on a PR
description: Fetch the review comments on a PR and and applies the requested code changes locally.
---

1. **Fetch the comments** using the GitHub CLI:
   
   gh pr-review review view --pr <user_provided_pr_number> --repo <repo_name>

2. **Analyze the review comments** provided in the output.

3. **Apply the changes**: For each valid technical suggestion, locate the relevant file in the workspace and modify the code to address the feedback.

4. **Verification**: Ensure the changes align with the reviewer's intent while maintaining code quality.

```

If the SKILL.md is being created in a Github repository, simply replace <repo_name> in the skill file with your repository name e.g. organization/repository.

### 2. Environment Setup

Your local environment needs the GitHub CLI and a `gh-pr-review` extension to fetch the PR comments. The official gh CLI only returns the top-level comments, `gh-pr-review` helps with retrieving the inline comments as well.


```bash
# Install GitHub CLI
brew install gh

# Install the extension for viewing inline/thread comments
gh extension install agynio/gh-pr-review

# Authenticate with your GitHub account
gh auth login

```

### 3. Execution

With the setup complete, you no longer need to copy-paste review comments from GitHub to address them. Simply tell the agent:

"Address the review comments on PR 20."

Antigravity pulls the comments, plans the edits, and modifies your local files. You just review the diff and push.
