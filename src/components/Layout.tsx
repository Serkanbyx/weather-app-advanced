import { Link, useLocation } from 'react-router-dom'
import { CloudSun, Heart, Settings, Menu, X, Thermometer } from 'lucide-react'
import { useState } from 'react'
import { useWeatherStore } from '@/store/weatherStore'
import { cn } from '@/lib/utils'

/**
 * Navigation links configuration
 */
const navLinks = [
  { to: '/', label: 'Weather', icon: CloudSun },
  { to: '/favorites', label: 'Favorites', icon: Heart }
]

/**
 * Header Component
 */
function Header() {
  const location = useLocation()
  const { unit, setUnit, favorites } = useWeatherStore()
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-40 glass border-b border-storm-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-weather-500/20 rounded-xl group-hover:bg-weather-500/30 transition-colors">
              <CloudSun className="w-6 h-6 text-weather-400" />
            </div>
            <span className="font-display font-bold text-xl text-storm-100 hidden sm:block">
              WeatherApp
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                    isActive 
                      ? 'bg-weather-500/20 text-weather-400' 
                      : 'text-storm-300 hover:text-storm-100 hover:bg-storm-700/50'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {link.to === '/favorites' && favorites.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-weather-500/30 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Unit Toggle */}
            <button
              onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
              className="btn-ghost hidden sm:flex"
              aria-label="Toggle temperature unit"
            >
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {unit === 'metric' ? '°C' : '°F'}
              </span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-storm-700/50 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-storm-300" />
              ) : (
                <Menu className="w-6 h-6 text-storm-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                      isActive 
                        ? 'bg-weather-500/20 text-weather-400' 
                        : 'text-storm-300 hover:text-storm-100 hover:bg-storm-700/50'
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                    {link.to === '/favorites' && favorites.length > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-weather-500/30 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )
              })}
              
              {/* Mobile Unit Toggle */}
              <button
                onClick={() => {
                  setUnit(unit === 'metric' ? 'imperial' : 'metric')
                  setMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                           text-storm-300 hover:text-storm-100 hover:bg-storm-700/50 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Units: {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Footer Component
 */
function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-storm-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-storm-400">
          <p>
            © {new Date().getFullYear()} WeatherApp. Data from{' '}
            <a 
              href="https://openweathermap.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-weather-400 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            PWA Ready • Works Offline
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Main Layout Component
 */
interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
