import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { WeatherCategory, ProcessedForecast, ForecastItem, ForecastResponse } from '@/types/weather'

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get weather category from weather condition ID
 * OpenWeather uses specific ID ranges for weather types
 */
export function getWeatherCategory(weatherId: number): WeatherCategory {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm'
  if (weatherId >= 300 && weatherId < 400) return 'drizzle'
  if (weatherId >= 500 && weatherId < 600) return 'rain'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId === 701) return 'mist'
  if (weatherId === 711) return 'smoke'
  if (weatherId === 721) return 'haze'
  if (weatherId === 731 || weatherId === 761) return 'dust'
  if (weatherId === 741) return 'fog'
  if (weatherId >= 801) return 'clouds'
  return 'clear'
}

/**
 * Get background gradient based on weather and time
 */
export function getWeatherGradient(weatherId: number, isNight: boolean): string {
  const category = getWeatherCategory(weatherId)
  
  if (isNight) {
    return 'from-storm-900 via-storm-800 to-indigo-950'
  }
  
  switch (category) {
    case 'clear':
      return 'from-weather-400 via-weather-500 to-sunny-400'
    case 'clouds':
      return 'from-storm-400 via-storm-500 to-storm-600'
    case 'rain':
    case 'drizzle':
      return 'from-weather-600 via-weather-700 to-storm-700'
    case 'thunderstorm':
      return 'from-storm-700 via-purple-900 to-storm-900'
    case 'snow':
      return 'from-storm-200 via-storm-300 to-weather-300'
    default:
      return 'from-storm-500 via-storm-600 to-storm-700'
  }
}

/**
 * Format temperature with unit symbol
 */
export function formatTemp(temp: number, unit: 'metric' | 'imperial' = 'metric'): string {
  const rounded = Math.round(temp)
  return unit === 'metric' ? `${rounded}°C` : `${rounded}°F`
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(speed: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'metric') {
    return `${speed.toFixed(1)} m/s`
  }
  return `${speed.toFixed(1)} mph`
}

/**
 * Format date from Unix timestamp
 */
export function formatDate(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', options)
}

/**
 * Format time from Unix timestamp
 */
export function formatTime(timestamp: number, timezone: number = 0): string {
  const date = new Date((timestamp + timezone) * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  })
}

/**
 * Get day name from date string
 */
export function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * Process 5-day forecast into daily summaries
 */
export function processForecast(forecast: ForecastResponse): ProcessedForecast[] {
  const dailyMap = new Map<string, ForecastItem[]>()
  
  // Group forecast items by date
  forecast.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    const existing = dailyMap.get(date) || []
    dailyMap.set(date, [...existing, item])
  })
  
  // Process each day
  const processed: ProcessedForecast[] = []
  
  dailyMap.forEach((items, date) => {
    const temps = items.map(i => i.main.temp)
    const humidities = items.map(i => i.main.humidity)
    const winds = items.map(i => i.wind.speed)
    const pops = items.map(i => i.pop)
    
    // Get midday weather for the day's icon (12:00 or closest)
    const middayItem = items.find(i => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)]
    
    processed.push({
      date,
      dayName: getDayName(date),
      temp: {
        min: Math.min(...temps),
        max: Math.max(...temps),
        avg: temps.reduce((a, b) => a + b, 0) / temps.length
      },
      weather: middayItem.weather[0],
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      wind: winds.reduce((a, b) => a + b, 0) / winds.length,
      pop: Math.max(...pops),
      items
    })
  })
  
  return processed.slice(0, 5) // Return only 5 days
}

/**
 * Get weather icon URL from OpenWeather
 */
export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}

/**
 * Generate unique ID for favorites
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if it's currently night based on sunrise/sunset
 */
export function isNightTime(sunrise: number, sunset: number, current: number): boolean {
  return current < sunrise || current > sunset
}

/**
 * Get wind direction from degrees
 */
export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(deg / 22.5) % 16
  return directions[index]
}
