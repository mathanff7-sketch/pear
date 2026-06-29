# PAINT - Private Makeup Atelier — Full Website (Frontend + Backend)

Idhu unga website full ah — frontend (HTML) + backend (booking API) rendum
**onna** combine panniyirukku. Adhanala oru place mattum deploy panna podhum.

## Folder structure
```
paint-fullstack/
├── server.js          ← backend + serves the website
├── package.json
├── public/
│   ├── index.html     ← unga website (booking form full ah idhula irukku)
│   └── images/        ← unga photos inga podunga (README.txt padikkavum)
└── data/
    └── bookings.json  ← bookings ellam inga save aagum
```

## ⚠️ Important: Missing images
Un HTML file la 15+ photos reference panniyirukku aana andha image files
upload pannala. `public/images/README.txt` la full list irukku.
Photos illama site work pannum, aana broken image icon mattum varum.
Photos ready ah irundha, `public/images/` folder la podunga.

---

## Local ah run panna (test panna)

```bash
npm install
npm start
```
Browser la `http://localhost:5000` open pannunga — unga full website varum,
booking form um work pannum.

---

## 🚀 LIVE ah host panna (Render — free, ungalaale pannanum)

Idha naan unga behalf la panna mudiyadhu, account creation ku email
verification venum. Aana steps romba simple, 5 nimisham mattum:

1. **GitHub la upload pannunga**
   - github.com → New Repository (e.g. `paint-website`)
   - Indha `paint-fullstack` folder full ah (ellame — server.js, package.json,
     public/, data/) upload pannunga ("uploading an existing file" button)

2. **Render la deploy pannunga**
   - render.com → Sign up (GitHub account oda login pannalam, fast)
   - Dashboard → **New +** → **Web Service**
   - Unga GitHub repo select pannunga
   - Settings automatic ah fill aagidum (`render.yaml` already irukku idhula):
     - Build Command: `npm install`
     - Start Command: `npm start`
   - **Create Web Service** click pannunga

3. **2-3 nimisham wait pannunga** — Render build panni deploy pannidum.
   Apo neenga oru live link kudukum, example:
   `https://paint-website.onrender.com`

4. **Done!** Andha link-a anyone open panna, full website + working
   booking form varum. Form submit panna apo bookings, `data/bookings.json`
   la save aagum (Render dashboard → Shell tab la pakkalam).

> Note: Render free tier la, 15 nimisham use illana app sleep aaidum,
> next request vandha apo 30-50 seconds la start aagum. Idhu normal.

---

## API Endpoints (reference)

| Method | Endpoint              | Description                              |
|--------|------------------------|-------------------------------------------|
| GET    | `/`                    | Website homepage                          |
| GET    | `/api/health`          | Backend health check                      |
| POST   | `/api/book`            | Create a new booking (form submit)        |
| GET    | `/api/bookings`        | List all bookings (admin)                 |
| GET    | `/api/bookings/:id`    | Get one booking by id                     |
| PATCH  | `/api/bookings/:id`    | Update status                             |
| DELETE | `/api/bookings/:id`    | Delete a booking                          |

## Bookings eppadi pakkalam
Live ah deploy pannana apo, browser la idha open pannunga:
`https://your-app-name.onrender.com/api/bookings`
(JSON format la ella bookings-um varum)
