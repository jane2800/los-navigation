---
marp: true

theme: default
paginate: true
backgroundColor: #ffffff
color: #333333
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  h1 {
    color: #F7B731;
  }
  h2 {
    color: #2d3436;
    border-bottom: 3px solid #F7B731;
    padding-bottom: 10px;
  }
  code {
    background: #f5f5f5;
    border-radius: 4px;
  }
  table {
    font-size: 0.85em;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
---

# LOS! 🚇

## Berlin Public Transport Journey Planner

**[Your Name]**
[Course Name] · [Date]

---

## The Problem

Berlin's public transport network is one of Europe's largest:

- 🚇 U-Bahn (10 lines)
- 🚆 S-Bahn (15 lines)
- 🚋 Tram (22 lines)
- 🚌 Bus (150+ lines)
- ⛴️ Ferry (6 lines)

### Challenges for users:
- Planning multi-stop journeys is tedious
- No easy way to save favorite routes
- Existing apps are cluttered with features

---

## The Solution: LOS!

A clean, focused journey planner with personalization.

| Feature | Description |
|---------|-------------|
| 🔍 Smart Search | Real-time stop suggestions |
| 🗺️ Multi-Stop | Add stopovers with durations |
| ⏱️ Options | Compare transport alternatives |
| 💾 Save | Store favorite journeys & stops |
| 🌐 Bilingual | English & German support |

---

## Key Features

### Journey Planning
- Search any Berlin stop with live autocomplete
- Add unlimited stopovers with custom wait times
- View multiple transport options per leg
- Edit journey from any point

### Personalization
- Create an account (username, email, password)
- Save complete journeys with all selected legs
- Save individual stops with custom names
- Saved stops appear first in search suggestions

---

## System Architecture
┌─────────────────────────────────────────────────┐
│ Frontend (React) │
│ Components · Context · CSS │
└─────────────────────┬───────────────────────────┘
│ Axios / REST
┌─────────────────────▼───────────────────────────┐
│ Backend (Node + Express) │
│ API Routes · Authentication │
└───────────┬─────────────────────┬───────────────┘
│ │
┌───────────▼───────────┐ ┌──────▼──────────────┐
│ PostgreSQL │ │ BVG REST API │
│ Users · Saves │ │ Transport Data │
└───────────────────────┘ └─────────────────────┘


---

## Technology Stack

<div class="columns">
<div>

### Frontend
- **React 18** - UI components
- **Vanilla CSS** - Custom styling
- **Axios** - HTTP requests
- **Context API** - Language state

</div>
<div>

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **node-fetch** - External API calls
- **pg** - PostgreSQL client

</div>
</div>

### Database: PostgreSQL
Relational data model for users, journeys, and stops

---

## Database Schema

Users (id, username, email, password, created_at)
   │
   ├──► SavedJourneys (id, name, origin, destination, 
   │                   stopovers, legs, user_id, created_at)
   │
   └──► SavedStops (id, stop_id, stop_name, 
                    custom_name, user_id, created_at)- **Users** → Authentication & ownership
- **SavedJourneys** → Complete route with all selected legs (JSONB)
- **SavedStops** → Individual stops with custom names

---

## External API Integration

### BVG Transport REST API
`https://v6.bvg.transport.rest`

| Endpoint | Purpose |
|----------|---------|
| `GET /locations?query=...` | Search stops by name |
| `GET /journeys?from=...&to=...` | Plan routes |
| `GET /stops/:id/departures` | Real-time departures |

---

## Frontend Components

| Component | Responsibility |
|-----------|----------------|
| `App.js` | Root state, view routing |
| `Header.js` | Navigation, language selector |
| `SearchForm.js` | Stop inputs, stopovers |
| `JourneyPlanner.js` | Leg selection logic |
| `JourneyProgress.js` | Visual journey display |
| `TransportOptions.js` | Option cards |
| `SavedJourneys.js` | Favorites management |
| `Account.js` | Auth forms, profile |

---

## User Flow
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Search     │    │   Select     │    │   Choose     │
│   Stops      │ ─► │   Stopovers  │ ─► │   Options    │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   View       │    │   Save       │    │   Complete   │
│   Saved      │ ◄─ │   Journey    │ ◄─ │   Journey    │
└──────────────┘    └──────────────┘    └──────────────s arrival + stopover duration |
| Git authentication | Personal Access Token (PAT) |

---

## Future Improvements

<div class="columns">
<div>

### Near-term
- Real-time delay notifications
- Dark mode toggle
- Route sharing via URL

</div>
<div>

### Long-term
- Progressive Web App (PWA)
- Mobile app (React Native)
- Bike-sharing integration

</div>
</div>

---

## Summary

### LOS! Delivers:

✅ **Intuitive** multi-stop journey planning
✅ **Real-time** BVG transport data
✅ **Personalized** saved routes & stops
✅ **Clean** bilingual interface
✅ **Modern** full-stack architecture

---

# Thank You! 🙏

## Questions?

**GitHub:** [your-repo-url]
**Demo:** http://localhost:3000

[Your Name] · [Your Email]