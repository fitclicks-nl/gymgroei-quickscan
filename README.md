# Fitclicks Groeiplan Scanner

## 🚀 Doel
Deze tool helpt fitnessondernemers in 60 seconden inzicht krijgen in waar hun grootste groeikans ligt (lead → lid).

De scan genereert automatisch een persoonlijk groeiplan op basis van ingevulde antwoorden.

---

## 🧠 Hoe het werkt

1. Gebruiker vult:
   - gymnaam
   - e-mailadres

2. Gebruiker doorloopt vragen:
   - type gym
   - aantal leden
   - doel
   - grootste uitdaging
   - huidige marketing
   - structuur
   - budget

3. Op basis van deze input:
   - wordt een groeifase bepaald
   - wordt een bottleneck geïdentificeerd
   - wordt een concreet stappenplan gegenereerd

4. Resultaat wordt direct getoond + verstuurd via Formspree

---

## ⚙️ Tech stack
- React (Vite)
- TypeScript
- Tailwind CSS

---

## 🔄 Deployment

Automatisch via GitHub Actions

### Flow:
1. Push naar `main`
2. GitHub build (`npm run build`)
3. Deploy via FTP naar:

---

## 🔑 Belangrijke secrets

- FTP_HOST
- FTP_USERNAME
- FTP_PASSWORD
- FTP_SERVER_DIR

---

## 📩 Lead verwerking

Leads worden verstuurd via Formspree:

- gymnaam
- e-mail
- alle antwoorden
- groeifase
- bottleneck
- impact
- stappenplan

---

## ⚠️ Let op

- `.htaccess` nodig voor routing (SPA)
- deploy map = `/groeiplan.fitclicks.nl`
- build output = `dist/`

---

## 🎯 Doel van deze tool binnen Fitclicks

- laagdrempelige instap
- bewustwording creëren
- kwalificeren van leads
- voorbereiding op kennismaking

---

## 💡 Positionering

Niet:
"meer leads genereren"

Maar:
"inzicht geven waar groei verloren gaat"

---

## 🔄 Volgende optimalisaties

- resultaten opslaan in CRM / database
- e-mail opvolging automatiseren
- scoring / lead kwalificatie uitbreiden
