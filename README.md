# Can You Pi? 

An interactive web game to test and improve your knowledge of Pi (π) digits. Challenge yourself with three unique game modes: Sequential, Quiz, and AI Buddy.

## Features

- **Sequential Mode**: Recite Pi digits in order and track your progress
- **Quiz Mode**: Guess the digit at a specific position with customizable difficulty
- **AI Buddy Mode**: Chat with an AI assistant that can help you learn Pi, provide hints, and play interactive games
- **High Score Tracking**: Your best scores are saved locally across sessions
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Retro Aesthetic**: Clean, bold neo-brutalist design with smooth animations

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Python FastAPI ([Backend Repo](https://github.com/riannelimje/can-you-pi))

## Getting Started

### Prerequisites

- Node.js 20+ and npm installed
- Backend server running (see [backend repo](https://github.com/riannelimje/can-you-pi))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/riannelimje/can-you-pi-frontend.git
cd can-you-pi-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your backend URL:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/     # Reusable components (Mascot, etc.)
├── quiz/          # Quiz mode page
├── sequential/    # Sequential mode page
├── terminal/      # AI Buddy terminal page
├── layout.tsx     # Root layout
└── page.tsx       # Home page
public/
└── pi.txt         # Pi digits data
```

