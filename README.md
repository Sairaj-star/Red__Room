# 🔴 RED ROOM

A simple 500-room private chat hotel for a college project.

## What it does

- Exactly 500 fixed rooms.
- Hotel-style reception with live room availability.
- Customer/guest flow without accounts.
- Booking requires a name (letters/spaces only) and 10-digit phone number.
- A 9-character private room key is generated after booking.
- Anyone with the key can enter the room.
- Real-time text chat plus small image/video sharing.
- Anonymous guest names inside rooms.
- Owner-only dashboard for room status, booking details, participants and chat activity.
- Owner can close rooms.
- Responsive mobile design.

## Run locally

Install Node.js 18+.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

For development:

```bash
npm run dev
```

## Owner credentials

Create `.env` from `.env.example` and set:

```env
OWNER_EMAIL=your-owner-email@example.com
OWNER_PASSWORD=your-secret-password
PORT=3000
```

Do not put the real password in frontend code or commit `.env` to GitHub.

Owner dashboard: `http://localhost:3000/owner`

## Render

1. Push this folder to GitHub.
2. Create a Render Web Service from the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add `OWNER_EMAIL` and `OWNER_PASSWORD` as Render environment variables.
6. Open the Render URL on phones.

`render.yaml` is included for convenience.

## Free-project limitation

Room state and chat are stored in server memory. A server restart or redeploy clears active rooms and messages. Media is deliberately limited to 7 MB per file to keep the free demo lightweight.

For a production service, use persistent storage and dedicated object storage for media.
