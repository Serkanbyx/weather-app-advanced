/**
 * Netlify Serverless Function - Weather API Proxy
 * 
 * This function receives requests from the frontend and forwards them to the OpenWeather API.
 * The API key stays only on this server side and is never exposed to the frontend.
 * 
 * Usage:
 * - GET /.netlify/functions/weather?city=Istanbul
 * - GET /.netlify/functions/weather?lat=41.01&lon=28.97
 */

// Node.js process declaration
declare const process: { env: Record<string, string | undefined> }

// Inline type definitions (Netlify Functions)
interface HandlerEvent {
  httpMethod: string
  queryStringParameters: Record<string, string | undefined> | null
}

interface HandlerResponse {
  statusCode: number
  headers?: Record<string, string>
  body: string
}

type Handler = (event: HandlerEvent) => Promise<HandlerResponse>

const OPENWEATHER_API_KEY = process.env['OPENWEATHER_API_KEY']
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPENWEATHER_AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// CORS headers - allow the browser to make requests from a different origin
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
}

// Error response helper
const errorResponse = (statusCode: number, message: string) => ({
  statusCode,
  headers,
  body: JSON.stringify({ error: message })
})

// Main handler function
export const handler: Handler = async (event) => {
  // OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Method not allowed. Use GET.')
  }

  // API key check
  if (!OPENWEATHER_API_KEY) {
    console.error('OPENWEATHER_API_KEY environment variable is not set')
    return errorResponse(500, 'Server configuration error')
  }

  // Read query parameters
  // Note: the frontend sends 'q' (OpenWeather API format); 'city' is also accepted
  const { city, q, lat, lon, type = 'weather', units = 'metric' } = event.queryStringParameters || {}

  // Use either the 'city' or 'q' parameter
  const cityName = q || city

  // The Air Quality endpoint only requires lat/lon
  if (type === 'air_pollution') {
    if (!lat || !lon) {
      return errorResponse(400, 'Air quality requires "lat" and "lon" parameters.')
    }

    const url = `${OPENWEATHER_AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`

    try {
      console.log(`Fetching air quality for: ${lat},${lon}`)
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        console.error('OpenWeather Air Pollution API error:', data)
        return errorResponse(response.status, data.message || 'Air Quality API error')
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      }
    } catch (error) {
      console.error('Air pollution fetch error:', error)
      return errorResponse(500, 'Failed to fetch air quality data')
    }
  }

  // Parameter validation (for weather/forecast)
  if (!cityName && (!lat || !lon)) {
    return errorResponse(400, 'Missing required parameters. Provide "city" (or "q") or "lat" and "lon".')
  }

  // Determine the endpoint (weather or forecast)
  const endpoint = type === 'forecast' ? 'forecast' : 'weather'

  // Build the URL
  let url = `${OPENWEATHER_BASE_URL}/${endpoint}?appid=${OPENWEATHER_API_KEY}&units=${units}`

  if (cityName) {
    url += `&q=${encodeURIComponent(cityName)}`
  } else {
    url += `&lat=${lat}&lon=${lon}`
  }

  try {
    console.log(`Fetching weather data for: ${cityName || `${lat},${lon}`}`)

    const response = await fetch(url)
    const data = await response.json()

    // Check for OpenWeather API errors
    if (!response.ok) {
      console.error('OpenWeather API error:', data)
      return errorResponse(response.status, data.message || 'Weather API error')
    }

    // Successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    }

  } catch (error) {
    console.error('Function error:', error)
    return errorResponse(500, 'Failed to fetch weather data')
  }
}
