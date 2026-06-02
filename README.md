# Fuel ATL Purchase vs Payment — Fund Health Check

Online-ready mobile PWA for iPhone/Safari, Vercel hosting, and Supabase-backed shared app state.

## Features

- Unique ATL Number purchase registration
- Exact Premium, Regular, and Diesel product lines
- Liter capacity and price per liter per product
- Philippine peso currency
- Open-date payment updates anytime
- Bank deposit slip attachment per payment
- Fund Health Check using:
  - Total UGT Value Converted to Cash
  - Total Balance on the Bank
  - Total Sales for Deposit
- Fund status: Healthy, Watch, or Critical with a visible 10% buffer target
- JSON export, browser local storage fallback, and optional Supabase cloud sync
- PWA manifest, service worker, and iPhone home-screen icon

## Run locally

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Test flow

1. Click **Load Sample**.
2. Confirm Outstanding Balance and Fund Health update at the top.
3. Edit the fund fields:
   - Total UGT Value Converted to Cash
   - Total Balance on the Bank
   - Total Sales for Deposit
4. Click **Update Fund Health**.
5. Add another payment with a payment date and deposit slip.
6. Confirm the Outstanding Balance and Fund Health recompute.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. Copy the project URL and a server-side secret key.

Use `SUPABASE_SECRET_KEY` if your project has new `sb_secret_...` keys. Legacy `SUPABASE_SERVICE_ROLE_KEY` also works. Do not put secret keys in browser code.

## Vercel setup

Set these environment variables in Vercel:

```text
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
APP_PIN=choose-a-private-pin
```

Then deploy the folder to Vercel. The app will use `/api/state` for cloud sync. If Supabase is not configured yet, it still runs offline using browser local storage.

## iPhone install

Open the Vercel URL in Safari, use Share, then Add to Home Screen. The app runs as a standalone mobile web app and caches the app shell for offline opening.
