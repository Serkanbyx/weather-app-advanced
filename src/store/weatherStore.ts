import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  FavoriteCity,
  UnitSystem,
  AirQualityResponse
} from '@/types/weather'
import { weatherApi } from '@/services/weatherApi'
import { generateId } from '@/lib/utils'

/**
 * Weather Store State Interface
 */
interface WeatherState {
  // Current search city
  currentCity: string
  
  // Weather data
  currentWeather: CurrentWeatherResponse | null
  forecast: ForecastResponse | null
  airQuality: AirQualityResponse | null
  
  // Favorites list
  favorites: FavoriteCity[]
  
  // UI states
  loading: boolean
  error: string | null
  
  // Settings
  unit: UnitSystem
  
  // Last viewed (for offline PWA)
  lastViewed: {
    city: string
    weather: CurrentWeatherResponse | null
    forecast: ForecastResponse | null
    airQuality: AirQualityResponse | null
    timestamp: number
  } | null
}

/**
 * Weather Store Actions Interface
 */
interface WeatherActions {
  // Search actions
  searchCity: (city: string) => Promise<void>
  fetchByCoords: (lat: number, lon: number, cityLabel: string) => Promise<void>
  clearSearch: () => void
  
  // Favorites actions
  addFavorite: (city: CurrentWeatherResponse) => void
  removeFavorite: (id: string) => void
  isFavorite: (cityName: string) => boolean
  loadFavoriteWeather: (favorite: FavoriteCity) => Promise<void>
  
  // Settings actions
  setUnit: (unit: UnitSystem) => void
  
  // Error handling
  clearError: () => void
}

type WeatherStore = WeatherState & WeatherActions

/**
 * Weather data bundle (weather + forecast + air quality)
 */
interface WeatherBundle {
  weather: CurrentWeatherResponse
  forecast: ForecastResponse
  airQuality: AirQualityResponse | null
}

/**
 * Fetch weather, forecast and air quality together.
 * Air quality is optional: a failure here must not break the main flow.
 */
async function loadWeatherBundle(
  weatherPromise: Promise<CurrentWeatherResponse>,
  forecastPromise: Promise<ForecastResponse>
): Promise<WeatherBundle> {
  const [weather, forecast] = await Promise.all([weatherPromise, forecastPromise])

  let airQuality: AirQualityResponse | null = null
  try {
    airQuality = await weatherApi.getAirQuality(weather.coord.lat, weather.coord.lon)
  } catch {
    console.warn('Air quality data unavailable')
  }

  return { weather, forecast, airQuality }
}

/**
 * Normalize unknown errors into a user-friendly message.
 */
function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to fetch weather data'
}

/**
 * Zustand Weather Store with Persistence
 */
export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCity: '',
      currentWeather: null,
      forecast: null,
      airQuality: null,
      favorites: [],
      loading: false,
      error: null,
      unit: 'metric',
      lastViewed: null,

      // Search for a city by name
      searchCity: async (city: string) => {
        if (!city.trim()) {
          set({ error: 'Please enter a city name' })
          return
        }

        set({ loading: true, error: null, currentCity: city })

        try {
          const { unit } = get()
          const { weather, forecast, airQuality } = await loadWeatherBundle(
            weatherApi.getCurrentWeather(city, unit),
            weatherApi.getForecast(city, unit)
          )

          set({
            currentWeather: weather,
            forecast,
            airQuality,
            loading: false,
            lastViewed: { city, weather, forecast, airQuality, timestamp: Date.now() }
          })
        } catch (error) {
          set({
            loading: false,
            error: toErrorMessage(error),
            currentWeather: null,
            forecast: null,
            airQuality: null
          })
        }
      },

      // Fetch weather by exact coordinates (avoids ambiguous city names)
      fetchByCoords: async (lat: number, lon: number, cityLabel: string) => {
        set({ loading: true, error: null, currentCity: cityLabel })

        try {
          const { unit } = get()
          const { weather, forecast, airQuality } = await loadWeatherBundle(
            weatherApi.getCurrentWeatherByCoords(lat, lon, unit),
            weatherApi.getForecastByCoords(lat, lon, unit)
          )

          set({
            currentWeather: weather,
            forecast,
            airQuality,
            loading: false,
            lastViewed: { city: cityLabel, weather, forecast, airQuality, timestamp: Date.now() }
          })
        } catch (error) {
          set({ loading: false, error: toErrorMessage(error) })
        }
      },

      // Clear search results
      clearSearch: () => {
        set({
          currentCity: '',
          currentWeather: null,
          forecast: null,
          airQuality: null,
          error: null
        })
      },

      // Add city to favorites
      addFavorite: (city: CurrentWeatherResponse) => {
        const { favorites } = get()
        
        // Check if already exists
        if (favorites.some(f => f.name.toLowerCase() === city.name.toLowerCase())) {
          return
        }

        const newFavorite: FavoriteCity = {
          id: generateId(),
          name: city.name,
          country: city.sys.country,
          coord: city.coord,
          addedAt: Date.now()
        }

        set({ favorites: [...favorites, newFavorite] })
      },

      // Remove city from favorites
      removeFavorite: (id: string) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(f => f.id !== id) })
      },

      // Check if city is in favorites
      isFavorite: (cityName: string) => {
        const { favorites } = get()
        return favorites.some(f => f.name.toLowerCase() === cityName.toLowerCase())
      },

      // Load weather for a favorite city (by coordinates for accuracy)
      loadFavoriteWeather: async (favorite: FavoriteCity) => {
        await get().fetchByCoords(favorite.coord.lat, favorite.coord.lon, favorite.name)
      },

      // Set temperature unit
      setUnit: (unit: UnitSystem) => {
        const { currentWeather } = get()
        set({ unit })

        // Refetch by coordinates so the active city stays exactly the same
        if (currentWeather) {
          get().fetchByCoords(
            currentWeather.coord.lat,
            currentWeather.coord.lon,
            currentWeather.name
          )
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        unit: state.unit,
        lastViewed: state.lastViewed
      })
    }
  )
)
