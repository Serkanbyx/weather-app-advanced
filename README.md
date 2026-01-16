# 🌤️ Weather App (Advanced)

A modern, feature-rich weather application built with React, TypeScript, and Tailwind CSS. Features PWA support for offline access and installability.

![Weather App Preview](preview.png)

## ✨ Features

- 🔍 **City Search** - Search for any city worldwide
- 📍 **Current Location** - Get weather for your location
- 🌡️ **Current Weather** - Real-time weather conditions
- 📅 **5-Day Forecast** - Extended weather predictions
- ⏰ **Hourly Forecast** - 24-hour weather breakdown
- ❤️ **Favorites** - Save cities for quick access
- 🌓 **Unit Toggle** - Switch between Celsius/Fahrenheit
- 📱 **PWA Support** - Install on mobile/desktop, works offline
- 🎨 **Beautiful UI** - Modern glassmorphism design
- 📱 **Responsive** - Works on all screen sizes

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| PWA | vite-plugin-pwa |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeather API key (free)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/weather-app-advanced.git
   cd weather-app-advanced
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure API Key**
   
   Create a \`.env\` file in the root directory:
   \`\`\`env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   \`\`\`
   
   Get your free API key at [OpenWeatherMap](https://openweathermap.org/api)

4. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in browser**
   Navigate to \`http://localhost:5173\`

## 📁 Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── Alert.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── CurrentWeather.tsx
│   ├── FavoriteCard.tsx
│   ├── Forecast.tsx
│   ├── Layout.tsx
│   └── SearchForm.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Favorites.tsx
│   └── CityDetail.tsx
├── store/              # Zustand state management
│   └── weatherStore.ts
├── services/           # API services
│   └── weatherApi.ts
├── types/              # TypeScript types
│   └── weather.ts
├── lib/                # Utility functions
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
\`\`\`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm run preview\` | Preview production build |
| \`npm run lint\` | Run ESLint |

## 🌐 API Reference

This app uses the [OpenWeather API](https://openweathermap.org/api):

- **Current Weather**: \`/data/2.5/weather\`
- **5-Day Forecast**: \`/data/2.5/forecast\`

## 📱 PWA Features

- ✅ Installable on desktop and mobile
- ✅ Works offline (caches last viewed weather)
- ✅ App icon and splash screen
- ✅ Auto-updates when new version available

### Installing the PWA

1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use the browser menu > "Install app"

## 🚀 Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Add environment variable:
   - Key: \`VITE_OPENWEATHER_API_KEY\`
   - Value: Your API key
4. Deploy!

### Build Commands

\`\`\`bash
# Build
npm run build

# The output will be in the dist/ folder
\`\`\`

## 🎨 Customization

### Colors

Edit \`tailwind.config.js\` to customize the color palette:

\`\`\`javascript
colors: {
  weather: { /* sky blue tones */ },
  sunny: { /* warm yellow/orange */ },
  storm: { /* dark slate tones */ }
}
\`\`\`

### Fonts

The app uses:
- **Outfit** - Body text
- **Syne** - Display headings

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

Made with ❤️ and React
