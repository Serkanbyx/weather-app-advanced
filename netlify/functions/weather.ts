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
  const { city, lat, lon, type = 'weather', units = 'metric' } = event.queryStringParameters || {}

  // Parametre validasyonu
  if (!city && (!lat || !lon)) {
    return errorResponse(400, 'Missing required parameters. Provide "city" or "lat" and "lon".')
  }

  // Endpoint belirleme (weather veya forecast)
  const endpoint = type === 'forecast' ? 'forecast' : 'weather'

  // URL oluşturma
  let url = `${OPENWEATHER_BASE_URL}/${endpoint}?appid=${OPENWEATHER_API_KEY}&units=${units}`
  
  if (city) {
    url += `&q=${encodeURIComponent(city)}`
  } else {
    url += `&lat=${lat}&lon=${lon}`
  }

  try {
    console.log(`Fetching weather data for: ${city || `${lat},${lon}`}`)
    
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
