---
title: "Zero Touch Agent-Powered Development"
date: "2026-10-17"
summary: "I tried a fully autonomous, zero-human-touch software development pipeline using Google Antigravity and Claude Code agents to build my latest side project."
image: "/images/zero-touch/zero-3.jpg"
---

I build quite a few software projects in my free time. For a while, I've used AI coding assistants to speed up routine tasks, but recently I wanted to take things a step further: could I run a **100% autonomous, zero-human-touch development pipeline** for personal projects?

Having active subscriptions to both Google Gemini and Claude, I have access to two capable agentic tools: **Antigravity** and **Claude Code**. Rather than picking one, I decided to pair them up as a complementary two-person engineering team. I will be acting as their product manager—defining specs and letting the agents handle the rest.

![Workflow](/images/zero-touch/zero-1.jpg?vmw=800)

### How It Works

**Round-Robin Issue Assignment**: Whenever a new issue is filed, a GitHub Actions workflow alternates assignment between **agy** and **claude**, balancing the backlog evenly. Since the agents run locally using my GitHub credentials, the workflow simply tags each issue with an `agy` or `claude` label based on whose turn it is.

**Isolated Parallel Workspaces**: A cron job on my machine runs every 15 minutes to check for open tickets tagged for each agent. If the queue is empty, it exits immediately without consuming any model tokens. When work is found, the assigned agent spins up in an isolated Git worktree. This prevents branch collisions and allows both agents to build and test concurrently without stepping on each other.

**Cross-Agent PR Handoff**: No agent merges its own code. When **agy** completes an issue and opens a pull request, it assigns the PR to **claude** for review (and vice versa). This triggers the peer agent to take ownership of the PR lifecycle.

![Handoff and Review Loop](/images/zero-touch/zero-2.jpg?vmw=800)

### Dual Review & Autonomous Merge

**CI & Automated First Pass**: The repository runs automated AI code reviews via Gemini Code Assist alongside standard CI test suites on every pull request. The reviewing peer agent waits for all initial CI checks and automated review bots to finish their pass.

**Peer Review & Local Fixes**: The peer agent then inspects the full pull request diff with fresh eyes. It addresses both automated feedback and its own findings, makes any necessary code adjustments directly in the worktree, runs the test suite locally, and pushes the fixes.

**Thread Resolution & Squash Merge**: Once all review conversation threads are resolved, the peer review is signed off, and all CI checks turn green, the peer agent autonomously squash-merges the pull request into `main`.

By separating the author from the reviewer and finisher, two distinct AI models cross-check each other's blind spots.

### The Verdict

I tested this setup manually for a few weeks first—generating PRs with Claude Code or Antigravity, manually prompting the other to review, and doing a final review myself before merging. This week, I automated the entire loop using GitHub Actions, cron jobs, and the respective CLI tools for both agents.

The setup works quite well, and features are shipped cleanly from end to end and there are a few learnings as well:

- **Spec quality is everything**: The output is only as good as the issue description. If requirements are ambiguous, the agents will make assumptions. Tickets need clear goals, defined constraints, and explicit acceptance criteria.
- **UX patterns need explicit guidance**: Unless UX expectations are stated upfront, agents will come up with UX that may not be the best for the user. For example, the agents initially built an infinite card grid for a data-dense view when a paginated table was clearly the better choice. Having design guidelines or component conventions in the repo is crucial.

For personal and non-critical side projects, this setup works quite well! It frees you up to think of the high-level system, architecture, and features, instead of getting bogged down in the implementation details. And these coding agents are tireless and run 24x7!

### Future Work and Enhancements

- Allow agents to assess PR complexity or risk and route intricate architectural changes to a human reviewer instead of auto-merging simply because CI is green.
- Set up recurring jobs to periodically inspect the repository and open issues for security vulnerabilities, technical debt, or refactoring opportunities.
- Setup the agents to spin up a browser, run end-to-end flows, and capture screenshots to visually evaluate and fix UI issues before PR handoff.
