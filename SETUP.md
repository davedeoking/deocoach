# DeoCoach: switching on the live services

The site works fully without these. Add the variables in **Vercel → deocoach-app → Settings → Environment Variables** and redeploy.

| Service | What it powers | Variables |
|---|---|---|
| Live AI | "Deepen with live AI" on briefings, and Ask the Supervisor | `ANTHROPIC_API_KEY`. Optional: `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`), `AI_HOURLY_LIMIT` (default 40 per visitor per hour) |

Coming next: Deo Cloud accounts (email/WhatsApp delivery of briefings), opt-in anonymised coach map for association dashboards.

Rebuild after editing anything in `src/`: `python3 src/build.py`
