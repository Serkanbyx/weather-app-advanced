import axios from 'axios'
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  ApiError,
  UnitSystem 
} from '@/types/weather'

/**
 * Weather API Service
 * 
 * Production'da: Netlify Functions üzerinden (API key gizli)
 * Development'ta: Direkt OpenWeather API (veya Netlify Dev)
 * 
 * API key artık frontend'de görünmez!
 */

// Environment detection
const isDevelopment = import.meta.env.DEV
const useDirectApi = isDevelopment && import.meta.env.VITE_OPENWEATHER_API_KEY

// API URLs
const NETLIFY_FUNCTION_URL = '/api/weather' // netlify.toml'da /api/* → /.netlify/functions/* redirect var
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Development için direkt API key (sadece local'de kullanılır)
const DEV_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/**
 * Axios instance - timeout ve base config
 */
const apiClient = axios.create({
  timeout: 10000
})

/**
 * Handle API errors
 */
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError
    
    if (apiError?.message) {
      if (apiError.message === 'city not found') {
        throw new Error('City not found. Please check the spelling and try again.')
      }
      if (apiError.message.includes('Invalid API key')) {
        throw new Error('API configuration error. Please try again later.')
      }
      throw new Error(apiError.message)
    }
    
    // Error response'dan mesaj al
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.')
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your internet connection.')
    }
  }
  
  throw new Error('An unexpected error occurred. Please try again.')
}

/**
 * Build API URL based on environment
 * Development: Direct to OpenWeather (key in URL)
 * Production: Through Netlify Function (key hidden)
 */
function buildUrl(endpoint: string, params: Record<string, string | number>): string {
  if (useDirectApi) {
    // Development - direkt API çağrısı
    const searchParams = new URLSearchParams({
      appid: DEV_API_KEY,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      )
    })
    return `${OPENWEATHER_BASE_URL}/${endpoint}?${searchParams}`
  } else {
    // Production - Netlify Function üzerinden
    const searchParams = new URLSearchParams({
      type: endpoint,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      )
    })
    return `${NETLIFY_FUNCTION_URL}?${searchParams}`
  }
}

/**
 * Weather API Service
 */
export const weatherApi = {
  /**
   * Get current weather by city name
   */
  async getCurrentWeather(city: string, unit: UnitSystem = 'metric'): Promise<CurrentWeatherResponse> {
    try {
      const url = buildUrl('weather', { q: city, units: unit })
      const response = await apiClient.get<CurrentWeatherResponse>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords(lat: number, lon: number, unit: UnitSystem = 'metric'): Promise<CurrentWeatherResponse> {
    try {
      const url = buildUrl('weather', { lat, lon, units: unit })
      const response = await apiClient.get<CurrentWeatherResponse>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get 5-day forecast by city name
   */
  async getForecast(city: string, unit: UnitSystem = 'metric'): Promise<ForecastResponse> {
    try {
      const url = buildUrl('forecast', { q: city, units: unit })
      const response = await apiClient.get<ForecastResponse>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get 5-day forecast by coordinates
   */
  async getForecastByCoords(lat: number, lon: number, unit: UnitSystem = 'metric'): Promise<ForecastResponse> {
    try {
      const url = buildUrl('forecast', { lat, lon, units: unit })
      const response = await apiClient.get<ForecastResponse>(url)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get current location weather
   */
  async getCurrentLocationWeather(unit: UnitSystem = 'metric'): Promise<{ weather: CurrentWeatherResponse; forecast: ForecastResponse }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const [weather, forecast] = await Promise.all([
              this.getCurrentWeatherByCoords(latitude, longitude, unit),
              this.getForecastByCoords(latitude, longitude, unit)
            ])
            resolve({ weather, forecast })
          } catch (error) {
            reject(error)
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission denied. Please enable location access.'))
              break
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable.'))
              break
            case error.TIMEOUT:
              reject(new Error('Location request timed out.'))
              break
            default:
              reject(new Error('An error occurred while getting your location.'))
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }
}
