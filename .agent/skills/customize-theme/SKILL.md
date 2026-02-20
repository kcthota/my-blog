---
name: Customize Theme
description: Instructions for customizing the blog's theme
---

# Customize Theme

This skill helps you customize the theme for the blog

## 1. Collect the required information

1. Ask the user if they want to customize the dark or light theme.
2. Ask the user for the background color they want to use for the theme.
3. Based on the background color, generate the other suitable colors for the theme.

Note: Ask one question at a time and wait for the user's response before asking the next question.

## 2. Update the theme files

Update the colors in `src/site.config.ts` file for the user chosen theme (dark/light).

```typescript
    dark:{
        primary: "#fff", // primary text color used for headings, buttons
        secondary: "#aaa", // secondary text color used for subheadings, metadata
        background: "#121212", // background color for the theme
        text: "#e0e0e0", // text color for the theme
        border: "#333", // border color for the theme
        cardBackground: "#373636ff", // card background color for the theme
        linkHover: "#fff", // link hover color for the theme
        linkColor: "#ccc", // link color for the theme
    }
```

## 3. Verify the changes

Let the user know that the theme has been customized and ask them to verify the changes.