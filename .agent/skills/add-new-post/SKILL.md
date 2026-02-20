---
name: Create a new post
description: Instructions for adding a new post to the blog
---

# Add a new post

This skill helps you add a new post to the Vending Mocha blog for the user.

## 1. Gather Information

Ask the user for the following information:

- **Post Title**: The title of the post.

## 2. Create the post markdown file and add content

1.  Create a new file in `posts/` with a descriptive filename (e.g., `my-new-post.md`).
2.  Add the required frontmatter at the top of the file:

### Example
```yaml
---
title: "Your Post Title"
date: "YYYY-MM-DD"
summary: "A brief summary of your post to be displayed in the list view."
---
```

3.  Write your content below the frontmatter using standard Markdown.

### Example

```markdown
---
title: "My New Post"
date: "2024-03-15"
summary: "A brief summary of my post."
---

# My New Post

This is the content of my new post.

## 3. Confirmation

Let the user know that the post has been created in `posts/` directory.