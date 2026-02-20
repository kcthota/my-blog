---
name: Customize Portal
description: Instructions for customizing the blog's appearance and configuration
---

# Customize Portal

This skill helps you customize the Vending Mocha blog for the user.

## 1. Gather Requirements

 **Ask the user** for the following information to tailor the blog:

- **Blog Title**: The name of the blog.
- **Description**: A short description or bio for the home page.
- **Social Links**: GitHub Profile URL, Email. Currently only email and github links are supported.
- **URL**: The URL of the blog.

Note: Ask the user one question at a time and wait for the response before asking the next question to collect the configuration data.

## 2. Update Configuration

The main configuration file is `src/site.config.ts`.


### Action

Update the `siteConfig` object with the user's details.

```typescript
export const siteConfig = {
    title: "User's Blog", // Update Title
    url: "https://example.com", // Update URL
    description: "Web Developer & Writer", // Update Description    
    contact: { // Update Socials
        github: "https://github.com/username",
        email: "user@example.com"
    }
};
```

## 3. Let the user know that profile picture can be updated by replacing profile.png image in the `src/static/images/` directory.

## 4. Verification

1.  Run `npm run dev` to start the local server.
2.  **Check Metadata**: Verify the title and description on the home page.
3.  **Check Links**: Click social links to ensure they work.