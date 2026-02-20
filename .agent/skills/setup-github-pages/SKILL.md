---
name: Setup GitHub Pages
description: Instructions for setting up the blog on GitHub Pages
---

# Setup GitHub Pages

This skill helps you setup the github workflow to regenerate the content of the blog.

## 1. Collect the required information

Check `src/site.config.ts` for the url. If the url is a github.io url, the user is using the default domain name. Otherwise, the user is using a custom domain name.

## 2. Setup the github workflow

1. Create a new file in the `.github/workflows/` directory if it does not exist.
2. Copy `resources/regenerate-content.yml` to `.github/workflows/regenerate-content.yml`.
3. If the user is using a custom domain, update the `regenerate-content.yml` file with the user's custom domain name as cname in 'Deploy to GitHub Pages' action. Following is an example:

```yaml
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
          cname: custom-domain-name.com
```
