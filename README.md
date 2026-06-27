# हिसाब-खाता — Loan Interest Calculator

A bilingual (Hindi / English) loan-interest calculator, styled like an
Indian ledger book ("khata"). Two modes:

1. **Date Range** — give a start date, end date, principal and rate; get
   the total interest and amount payable, with a full year-by-year
   breakdown.
2. **EMI / Partial Payments** — track a loan where the borrower pays back
   money in instalments on various dates; each payment settles interest
   accrued so far and reduces the principal for what's still owed.

Everything runs entirely in the browser — no backend, no database, no
data ever leaves the device.

---

## 1. Run it locally

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
# 1. Unzip this project, then open a terminal in the folder
cd loan-calculator

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) in your browser.
Changes you make to the code will hot-reload instantly.

To build a production bundle and preview it locally:

```bash
npm run build      # outputs to dist/
npm run preview    # serves the dist/ build locally
```

---

## 2. Deploy to Vercel (free)

**Easiest way — via GitHub:**

1. Create a new GitHub repository and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Loan interest calculator"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import
   that GitHub repo.
3. Vercel auto-detects Vite. Leave the defaults (Build Command:
   `npm run build`, Output Directory: `dist`) and click **Deploy**.
4. You'll get a live `https://your-app.vercel.app` URL in about a minute.

**Alternative — Vercel CLI, no GitHub needed:**

```bash
npm install -g vercel
vercel login
vercel --prod
```
Follow the prompts (accept the defaults). It will build and deploy
straight from your machine.

Either way, this is entirely within Vercel's free Hobby plan — it's a
static site with no server functions, so there's nothing to scale and
nothing to pay for.

### Why it's fast

- It's a pure static build (Vite) — no server-side rendering, so every
  page load is just static files served from Vercel's CDN.
- JS/CSS files are content-hashed (`vercel.json` sets them to cache
  `immutable` for a year) — repeat visits load instantly from cache.
- A service worker (via `vite-plugin-pwa`) precaches the whole app shell
  on first visit, so the app keeps working — and loads instantly — even
  offline or on a flaky connection. It can even be "installed" to a
  phone's home screen like a native app.

---

## 3. How the calculation works

- **Interest formula:** `Principal × Rate × Days ÷ 30` — a flat 30-day
  month, same for every month regardless of how many days it actually
  has.
- **Minimum 15 days:** any accrual period shorter than 15 days is still
  charged for a full 15 days.
- **Yearly compounding:** every 365 days (from the original start date,
  then from each subsequent compounding point), the interest accrued in
  that block is folded into the principal. All later interest is
  calculated on this larger principal. This keeps repeating every 365
  days for as long as the loan runs.
- **Partial payments (EMI mode):** each payment first settles the
  interest accrued since the last event, then is deducted from the
  principal. Payments do **not** reset the 365-day compounding clock —
  that clock runs continuously from the original start date regardless
  of how many payments are made in between.
- Dates are shown in Indian `DD-MM-YYYY` format throughout. Money is
  shown in the Indian numbering system (lakh/crore comma grouping), e.g.
  `₹12,73,750.00`.

The full chronological breakdown (every year-end fold, every payment,
and the final balance) is shown in the results table so every number can
be checked by hand.

A correctness check against several worked examples lives in
`scripts/verify-engine.mjs` — run it with:

```bash
node scripts/verify-engine.mjs
```

> **Note on the native date pickers:** the date fields use the
> browser's built-in date picker for easy tapping on mobile. Its on-screen
> format (e.g. `mm/dd/yyyy` vs `dd/mm/yyyy`) follows the phone/browser's
> own language & region setting — on a phone set to an Indian locale it
> will show `dd/mm/yyyy` natively. Underneath every date field, the app
> always shows the selected date in unambiguous Indian `DD-MM-YYYY`
> format as well, so there's never any confusion either way.

---

## 4. Project structure

```
src/
  components/        UI components (inputs, results, breakdown table…)
  i18n/              English + Hindi text, language context
  utils/
    interestEngine.js  The core calculation engine (mode-agnostic)
    dateUtils.js        Date formatting/parsing helpers
    numberUtils.js      Indian-number-system formatting helpers
scripts/
  verify-engine.mjs    Standalone correctness check for the engine
vercel.json            Deployment + caching configuration
```

---

## 5. Customizing

- **Default rate / options:** edit `rateDefault` / `rateAlt` labels in
  `src/i18n/en.js` & `hi.js`, and the `options` array in
  `src/components/RateSelector.jsx`.
- **Colors / fonts ("ledger" theme):** all defined as CSS variables in
  `src/index.css` under `@theme`.
- **Wording / translations:** everything text-based lives in
  `src/i18n/en.js` and `src/i18n/hi.js` — same keys in both files.
