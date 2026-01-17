/**
 * Netlify Serverless Function - Weather API Proxy
 * 
 * Bu fonksiyon frontend'den gelen istekleri alır ve OpenWeather API'ye yönlendirir.
 * API key sadece bu sunucu tarafında kalır, frontend'de asla görünmez.
 * 
 * Kullanım:
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

// CORS headers - tarayıcının farklı origin'den istek yapmasına izin verir
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
}

// Hata response helper
const errorResponse = (statusCode: number, message: string) => ({
  statusCode,
  headers,
  body: JSON.stringify({ error: message })
})

// Ana handler fonksiyonu
export const handler: Handler = async (event) => {
  // OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Sadece GET isteklerine izin ver
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Method not allowed. Use GET.')
  }

  // API key kontrolü
  if (!OPENWEATHER_API_KEY) {
    console.error('OPENWEATHER_API_KEY environment variable is not set')
    return errorResponse(500, 'Server configuration error')
  }

  // Query parametrelerini al
  // Not: Frontend 'q' parametresi gönderir (OpenWeather API formatı), 'city' de kabul edilir
  const { city, q, lat, lon, type = 'weather', units = 'metric' } = event.queryStringParameters || {}

  // city veya q parametresinden birini kullan
  const cityName = q || city

  // Air Quality endpoint için sadece lat/lon gerekli
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

  // Parametre validasyonu (weather/forecast için)
  if (!cityName && (!lat || !lon)) {
    return errorResponse(400, 'Missing required parameters. Provide "city" (or "q") or "lat" and "lon".')
  }

  // Endpoint belirleme (weather veya forecast)
  const endpoint = type === 'forecast' ? 'forecast' : 'weather'

  // URL oluşturma
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

    // OpenWeather API hatası kontrolü
    if (!response.ok) {
      console.error('OpenWeather API error:', data)
      return errorResponse(response.status, data.message || 'Weather API error')
    }

    // Başarılı response
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
