# 163productions.com

The 163 Productions website, served by GitHub Pages from `main` (custom domain in `CNAME`; DNS on Cloudflare).
Plain HTML, no build step: push to `main` and it is live in a minute or two.

## Pages the apps depend on (keep these URLs working)
| URL | Why |
|---|---|
| `/privacy` | StreamEasy privacy policy. App Store and Google Play link to it, and the in-app terms do too. |
| `/support` | Support page. App Store requires it. |
| `/streameasy/terms` | The terms people agree to in the StreamEasy app. |

Restyle and move things around freely, but **don't change what the privacy policy or terms say** without checking with
the StreamEasy side: they must match what the app actually does (and the terms text must match the app's copy in the
streameasy repo, `service/src/terms.js`). Both are drafts pending legal review.
