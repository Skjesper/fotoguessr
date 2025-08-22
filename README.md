# LindholmenGuesser 🎯

A location-based guessing game built with Next.js where players guess locations from images, navigate to them in real life, and earn stars based on their speed. Features a comprehensive leaderboard system with Supabase integration.

## Features

- 🗺️ **Google Street View Integration** - Display interactive street view images using Google Maps API
- 📍 **Real-world Navigation** - Players must physically visit guessed locations
- ⭐ **Star-based Scoring System** - Earn 1-3 stars based on time remaining
- 🏆 **Dynamic Leaderboard** - Persistent scoring with Supabase database
- 👤 **Player Profiles** - Save player names in localStorage with automatic score tracking
- ⏰ **Time-based Levels** - Multiple daily challenges (08:00-11:00, 11:00-13:00, 13:00-19:00)
- 🎮 **Complete Game Flow** - Onboarding → Levels → Game → Results → Leaderboard

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Database:** Supabase (PostgreSQL)
- **Language:** JavaScript (ES6+)
- **Styling:** CSS Modules with custom design system
- **APIs:**
  - Google Maps Street View Static API
  - Browser Geolocation API
  - Supabase REST API
- **UI Components:** Custom reusable components (Button, Header, Stars, Levels)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Google Maps API key with Street View Static API enabled
- Supabase project with database setup

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd LindholmenGuesser
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:
   Create a table called `leaderboard` with the following structure:

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
LindholmenGuesser/
├── src/
│   ├── app/
│   │   ├── page.js                    # Home page
│   │   ├── onboarding/
│   │   │   └── page.js               # Player name registration
│   │   ├── levels/
│   │   │   └── page.js               # Time-based level selection
│   │   ├── gamePage/
│   │   │   └── page.js               # Main game with Street View
│   │   ├── gameComplete/
│   │   │   └── page.js               # Results and star calculation
│   │   ├── leaderboard/
│   │   │   └── page.js               # Score ranking display
│   │   ├── gelocation/
│   │   │   └── page.js               # Geolocation tutorial
│   │   └── api/
│   │       └── leaderboard/
│   │           └── route.js          # Supabase API endpoints
│   ├── components/
│   │   ├── Button/                   # Reusable button component
│   │   ├── FotoguesserHeader/        # App header with navigation
│   │   ├── Stars/                    # Star rating display
│   │   └── Levels/                   # Level selection component
│   └── lib/
│       └── supabase.js              # Supabase client configuration
├── public/
│   └── *.svg                        # Game icons and assets
└── *.module.css                     # Component-specific styles
```

## Game Flow

1. **Home Page** (`/`) - Welcome screen with play button
2. **Onboarding** (`/onboarding`) - Player name registration (skipped if name exists)
3. **Levels** (`/levels`) - Time-based challenge selection
4. **Game Page** (`/gamePage`) - Street View image display and location guessing
5. **Game Complete** (`/gameComplete`) - Results with star calculation and automatic score saving
6. **Leaderboard** (`/leaderboard`) - Global ranking display

## Supabase Integration

### Database Schema

```sql
-- Leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
```

### API Endpoints

**GET `/api/leaderboard`**

- Fetches top 10 players ordered by score
- Returns: `[{ id, name, score, created_at }]`

**POST `/api/leaderboard`**

- Adds or updates player scores
- Body: `{ name: string, score: number, action: "add" }`
- Action "add" accumulates scores for existing players

### Supabase Client Setup

```javascript
// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Scoring System

### Star Calculation

Stars are awarded based on time remaining when the player reaches the target location:

- **3 Stars:** 20+ minutes remaining (≥1200 seconds)
- **2 Stars:** 10-20 minutes remaining (600-1199 seconds)
- **1 Star:** 0-10 minutes remaining (1-599 seconds)
- **0 Stars:** Failed to reach location or time expired

### Score Accumulation

- Each game adds earned stars to the player's total score
- Scores persist across sessions using Supabase
- Leaderboard displays cumulative scores from all games played

## Components

### Custom Components

**Button** (`src/components/Button.jsx`)

- Versatile button supporting both navigation (Link) and action (onClick)
- Variants: `primary`, `secondary`, `dark`, `light`
- Icon support and disabled states

**FotoguesserHeader** (`src/components/FotoguesserHeader/`)

- Consistent header with back navigation
- Centered title with positioned back arrow

**Stars** (`src/components/Stars/`)

- Visual star rating display (1-3 stars)
- Used in game results and scoring

**Levels** (`src/components/Levels/`)

- Time-slot based level selection
- Handles unlock logic and completion tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Locations

Modify coordinates in game components or create a locations configuration file for dynamic location selection.

### Environment Variables

```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add all environment variables
4. Deploy!

### Supabase Setup for Production

1. Create a new Supabase project
2. Set up the database schema
3. Configure Row Level Security policies if needed
4. Add environment variables to your deployment platform

## API Usage

### Google Street View Static API

```javascript
const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&key=${API_KEY}`;
```

### Supabase Queries

```javascript
// Fetch leaderboard
const { data, error } = await supabase
  .from("leaderboard")
  .select("*")
  .order("score", { ascending: false })
  .limit(10);

// Add/update score
const { error } = await supabase
  .from("leaderboard")
  .upsert({ name, score: existingScore + newScore });
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

Built with ❤️ using Next.js, Supabase, and Google Maps API
