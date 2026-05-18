---
title: "How I built my own assistant app?"
date: "2026-05-17"
summary: "I have vibe coded my own assistant app to track bills, credit card benefits, upcoming travel and more. Here is how I did it."
---

I extensively use [Gemini](https://gemini.google.com/) for my day to day tasks and it works great. But I was looking to build something that can help me track my bills, monthly credit card benefits, upcoming travel, notify me of stuff that I care about. I enjoy the process of building, so I decided to build my own assistant app. Previously I used to track these using a combination of Google Sheets, reminders and various other tools. But now all these are consolidated into a single application. 

## Online Assist via Chat

Nothing fancy here, yet another chat assistant. A standard chat interface to interact with the assistant that uses Google Search tool to fetch information from the web. The backend uses [Google ADK](https://adk.dev/) + [Gemini 3.0 flash](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-flash) + SSE for any live chat iteractions. I can simply ask the chat assistant - "summarize the current market news for me" and it will fetch the latest news from the web and present it in a summarized format.

![Chat Assistant](/images/my-assist/chat1.jpg?vmw=800)

## Scheduled Offline Assist

While the live interactions are useful, I wanted the assistant to be proactive and send me updates about things that matter to me. Examples of such interactions include: daily news briefing, weekly bill reminders, daily market updates etc. 

I pretty much reused the same implementation used by the chat assistant APIs to perform these tasks, but executed via a scheduler instead of a live chat session. Scheduled tasks can be setup via Chat Assistant, which creates a persistent record in the database with a cron expression. A scheduler thread wakes up every 5 minutes, checks if there are any pending tasks and executes them.

![Scheduled Tasks via Chat Assistant](/images/my-assist/chat2.jpg?vmw=800)

![Scheduled Tasks via Chat Assistant](/images/my-assist/chat3.jpg?vmw=800)

Scheduled tasks can be managed via a simple UI for convenience and easy mutation if needed. Here is how I can see all my scheduled tasks.

![Scheduled Tasks](/images/my-assist/scheduled.jpg?vmw=800)

## Tools

Whether executed via live chat agent or on schedule, the agent has access to a set of tools to perform various tasks. These tools include:

**Google Search** - The search tool available via Google ADK for performing live web searches.

**Email Notifications** - A tool for sending email notifications via Mailjet.

**Scheduled Tasks** - A tool for scheduling tasks backed by a database table.

**Query Bills** - A tool for querying bills. The functionality that I have previously built part of the web app.

**Query Travel** - A tool for querying travel itineraries that I have previously built for helping with my daughter's volleyball travel and family travel spread across multiple airlines and hotels.

**Query Benefits** - A tool for managing credit card benefits based on the cards I use.

I can continue to add tools to the assistant as I go.

## TechStack

- Backend: Python/FastAPI
- Frontend: React
- Database: Postgres/Cloud SQL
- Deployment: GCP/Cloud Run
- Agents: Google ADK + Gemini 3.0 Flash
- Email notifications: Mailjet

I have exclusively used [Antigravity](https://antigravity.google/) for building the service. The backend is built using Python/FastAPI and the frontend is built using React. At the core of this application is a scheduler that leverages Postgres based locks that gets invoked to check if there are any tasks to be performed, clean up jobs to be run, or notifications to be sent out. 

I have also spent time setting up the github workflows for CI/CD, automated database migrations and few other infrastructure pieces to simplify my development workflow. Setting up the infra using tools like Cloud Run, Cloud SQL and setting up CI/CD pipelines using Github actions was a breeze and I was able to get it done fairly quickly.

- PRs to main will automatically be reviewed by [Gemini Code Assist](https://github.com/apps/gemini-code-assist). This is super useful as it ensures that the code quality is maintained.
- A skill described [here](https://kcthota.com/post/address-review-comments/) helps with addressing PR comments quickly and easily.
- Push to main kicks off a github workflow that automatically builds, tests, and deploys the application to Cloud Run.

While I did not describe the entire functionality that I have built part of the app, I am pretty happy with how the app turned out and how the agent is able to help me with my day to day tasks. I am excited to see how it evolves over time as I continue to add more features and capabilities to it. 