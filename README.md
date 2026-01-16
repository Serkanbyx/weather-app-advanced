# 🌤️ Weather App Advanced

A modern, feature-rich Progressive Web Application (PWA) for weather forecasting. Built with React 18, TypeScript, and Tailwind CSS. Features real-time weather data, 5-day forecasts, favorites management, and offline support.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **City Search**: Search for any city worldwide with real-time suggestions
- **Current Location**: Get instant weather for your location using Geolocation API
- **Real-Time Weather**: Display current temperature, humidity, wind speed, and conditions
- **5-Day Forecast**: Extended weather predictions with daily breakdowns
- **Hourly Forecast**: 24-hour detailed weather breakdown
- **Favorites System**: Save frequently checked cities for quick access
- **Unit Toggle**: Switch seamlessly between Celsius and Fahrenheit
- **PWA Support**: Install on mobile/desktop devices, works offline with cached data
- **Glassmorphism UI**: Modern, beautiful interface with glass-effect design
- **Fully Responsive**: Optimized for all screen sizes from mobile to desktop
- **Secure API**: API keys hidden using Netlify serverless functions
- **Persistent Storage**: Favorites and settings saved in LocalStorage

## Live Demo

[🎮 View Live Demo](https://weather-app-advancedd.netlify.app)

## Technologies

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite 6**: Lightning-fast build tool and development server
- **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
- **Zustand 5**: Lightweight state management with persistence middleware
- **React Router v6**: Client-side routing with nested routes
- **React Hook Form + Zod**: Type-safe form handling and validation
- **Axios**: Promise-based HTTP client with interceptors
- **Lucide React**: Beautiful, consistent icon library
- **vite-plugin-pwa**: Progressive Web App support with Workbox
- **Netlify Functions**: Serverless functions for secure API proxy
- **OpenWeather API**: Real-time weather data provider

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- OpenWeather API key (free tier available)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/weather-app-advanced.git
cd weather-app-advanced
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
# Create .env file in root directory
touch .env
```

4. Add your API key to `.env`:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

5. Get your free API key at [OpenWeatherMap](https://openweathermap.org/api)

6. Start development server:

```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

### Using Netlify Dev (Recommended for production-like environment)

```bash
npm run dev:netlify
```

This runs the app with Netlify Functions for secure API key handling.

## Usage

1. **Search for a City**: Enter a city name in the search bar and press Enter or click the search button
2. **Use Current Location**: Click the location button to get weather for your current position
3. **View Forecast**: Scroll down to see the 5-day forecast with hourly details
4. **Add to Favorites**: Click the heart icon to save a city to your favorites
5. **Switch Units**: Toggle between Celsius and Fahrenheit using the unit switcher
6. **Access Favorites**: Navigate to the Favorites page to view all saved cities
7. **Install PWA**: Click the install button in your browser to add the app to your home screen

## How It Works?

### Architecture

The application follows a clean architecture pattern with separation of concerns:

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (Alert, Skeleton, Toast)
│   ├── CurrentWeather.tsx
│   ├── FavoriteCard.tsx
│   ├── Forecast.tsx
│   ├── Layout.tsx
│   └── SearchForm.tsx
├── pages/            # Page-level components
│   ├── Home.tsx
│   ├── Favorites.tsx
│   └── CityDetail.tsx
├── store/            # Zustand state management
│   └── weatherStore.ts
├── services/         # API service layer
│   └── weatherApi.ts
├── types/            # TypeScript type definitions
│   └── weather.ts
└── lib/              # Utility functions
    └── utils.ts
```

### State Management

Zustand store manages global state with persistence:

```typescript
// Weather data, favorites, and settings are persisted to localStorage
const useWeatherStore = create(
  persist(
    (set, get) => ({
      currentWeather: null,
      forecast: null,
      favorites: [],
      unit: "metric",
      // ... actions
    }),
    { name: "weather-storage" }
  )
);
```

### API Security

Production builds use Netlify Functions to proxy API requests:

```
Frontend Request → Netlify Function → OpenWeather API
                   (API key hidden)
```

### PWA Configuration

Service worker caches assets and API responses:

```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "weather-api-cache",
        expiration: { maxAgeSeconds: 60 * 30 }, // 30 minutes
      },
    },
  ];
}
```

## Customization

### Add Custom Themes

Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  weather: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... your custom sky blue tones
  },
  sunny: {
    // warm yellow/orange for sunny conditions
  },
  storm: {
    // dark slate tones for stormy weather
  }
}
```

### Change Fonts

The app uses Google Fonts. Modify `index.html` to change fonts:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap"
  rel="stylesheet"
/>
```

### Modify Cache Duration

Adjust weather data cache time in `vite.config.ts`:

```typescript
expiration: {
  maxEntries: 50,
  maxAgeSeconds: 60 * 60 // Change to 1 hour
}
```

## Features in Detail

### Completed Features

- ✅ City search with error handling
- ✅ Geolocation-based weather
- ✅ Real-time weather display
- ✅ 5-day forecast with daily breakdown
- ✅ Hourly forecast for 24 hours
- ✅ Favorites management (add/remove)
- ✅ Celsius/Fahrenheit toggle
- ✅ PWA installation support
- ✅ Offline mode with cached data
- ✅ Responsive glassmorphism design
- ✅ Secure API key handling
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Error boundaries

### Future Features

- [ ] Weather alerts and notifications
- [ ] Multiple language support (i18n)
- [ ] Weather maps integration
- [ ] Air quality index (AQI)
- [ ] Sunrise/sunset times
- [ ] Weather widgets
- [ ] Dark/light theme toggle
- [ ] Weather history charts

## Available Scripts

| Command               | Description                   |
| --------------------- | ----------------------------- |
| `npm run dev`         | Start Vite development server |
| `npm run dev:netlify` | Start with Netlify Functions  |
| `npm run build`       | Build for production          |
| `npm run preview`     | Preview production build      |
| `npm run lint`        | Run ESLint for code quality   |

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variable in Netlify dashboard:
   - Key: `OPENWEATHER_API_KEY`
   - Value: Your API key
4. Deploy automatically on push

### Manual Build

```bash
npm run build
# Output will be in dist/ folder
```

## Contributing

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feat/amazing-feature
```

3. Commit your changes:

```bash
git commit -m "feat: add amazing feature"
```

4. Push to the branch:

```bash
git push origin feat/amazing-feature
```

5. Open a Pull Request

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `style:` - Code style changes

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- PWA support by [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- Hosting by [Netlify](https://www.netlify.com/)

## Contact

- For issues and bugs: [Open an Issue](https://github.com/Serkanbyx/weather-app-advanced/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com)

---

⭐ If you like this project, don't forget to give it a star!
