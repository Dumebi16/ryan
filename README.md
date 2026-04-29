<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/741abe35-b47a-46ef-b77f-c7ec0ea61669

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Retell AI Integration

Ryan's website includes an AI phone agent powered by [Retell AI](https://retellai.com). Visitors can request an instant outbound call from Ryan's AI assistant directly from the Contact page.

### How it works

- **Inbound**: Callers dial **(947) 218-1845** and reach the Retell AI agent directly.
- **Outbound**: Visitors fill in their name and phone on the Contact page and click **"Start AI Call"** — the site POSTs to `/api/retell/create-call`, which triggers Retell to place a call to the visitor's number within seconds.

### Required environment variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables** (or in `.env.local` for local dev with `vercel dev`):

| Variable | Description |
|---|---|
| `RETELL_API_KEY` | Your Retell secret key — found in the Retell dashboard under API Keys |
| `RETELL_AGENT_ID` | The agent ID of the configured inbound/outbound agent in Retell |
| `RETELL_PHONE_NUMBER_ID` | The from-number (`+19472181845`) — already set as the default fallback |

> **Never prefix these with `VITE_`** — that would expose them in the browser bundle. They must remain server-side only.

### Testing inbound calls

Call **(947) 218-1845** directly from any phone. The Retell agent will answer and handle the conversation per its configured script.

### Testing outbound calls (from the UI)

1. Run `vercel dev` (not `npm run dev`) — this starts both the Vite frontend and the `/api` serverless functions locally.
2. Go to `http://localhost:3000/contact`.
3. Fill in your name and a real phone number in the **"Get an Instant AI Callback"** section.
4. Click **"Start AI Call"** — your phone should ring within seconds.

### Why API keys must stay server-side

The Retell API key has full account access. If it were included in the frontend bundle (e.g. via a `VITE_` prefix), anyone could extract it from the browser and make API calls on Ryan's behalf. The `/api/retell/create-call` serverless function acts as a secure proxy — the browser never sees the key.
