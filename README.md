# AI Pulse

Daily AI market intelligence: the stories that matter, the numbers behind them, and what to do next.

**Live site:** [ai-pulse.in](https://ai-pulse.in)

## How it works

- A new issue is published every day, and the day's issue is checked for new AI stories every 2 hours.
- Every fact and figure is taken from the original source and linked on the page.
- Each story includes a plain-language summary, why it matters, key numbers, and recommendations by role.
- Readers can ask questions about any issue with the built-in **Ask AI Pulse** assistant.

## Folder structure

| Path | What it contains |
|---|---|
| `index.html` | Today's issue (the home page) |
| `archive/` | Every past issue, plus the archive list page (`archive/index.html`) |
| `assets/icons/` | Logo files used as the browser tab and home-screen icons |
| `assets/images/` | The preview image shown when the site is shared on LinkedIn, WhatsApp or X |
| `assets/js/` | `chat.js` – the Ask AI Pulse chat box shown on every issue page |
| `chat-worker/` | The Cloudflare helper behind the chat box (`worker.js`) and the assistant's answering rules (`rules.txt`) |
| `favicon.ico` | Tab icon for older browsers (kept at the top level, where browsers look for it) |
| `CNAME` | Connects the site to the ai-pulse.in domain |

## Please don't move

These paths are used by the live site, the domain, or already-shared links:

- `index.html`, `CNAME` and `favicon.ico` must stay at the top level.
- File names in `archive/` are public links – renaming them breaks links people have shared.
- `chat-worker/rules.txt` is read live by the chat assistant.

## Notes

AI Pulse summarizes publicly reported news with links to the original sources; all analysis is our own.
