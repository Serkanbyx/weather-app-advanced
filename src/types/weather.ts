/**
 * OpenWeather API Response Types
 * Typed interfaces for weather data
 */

// Current Weather API Response
export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudData;
  rain?: PrecipitationData;
  snow?: PrecipitationData;
  dt: number;
  sys: SystemData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudData {
  all: number;
}

export interface PrecipitationData {
  '1h'?: number;
  '3h'?: number;
}

export interface SystemData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

// 5-Day / 3-Hour Forecast API Response
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: CityData;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: CloudData;
  wind: WindData;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: PrecipitationData;
  snow?: PrecipitationData;
  sys: {
    pod: 'd' | 'n'; // Part of day (day/night)
  };
  dt_txt: string;
}

export interface CityData {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// App-specific types
export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  coord: Coordinates;
  addedAt: number;
}

export interface ProcessedForecast {
  date: string;
  dayName: string;
  temp: {
    min: number;
    max: number;
    avg: number;
  };
  weather: WeatherCondition;
  humidity: number;
  wind: number;
  pop: number;
  items: ForecastItem[];
}

// API Error Response
export interface ApiError {
  cod: string | number;
  message: string;
}

// Weather condition categories for styling
export type WeatherCategory = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'drizzle' 
  | 'thunderstorm' 
  | 'snow' 
  | 'mist' 
  | 'fog'
  | 'haze'
  | 'dust'
  | 'smoke';

// Unit system
export type UnitSystem = 'metric' | 'imperial';

// Air Quality Index Response
export interface AirQualityResponse {
  coord: Coordinates;
  list: AirQualityData[];
}

export interface AirQualityData {
  main: {
    aqi: 1 | 2 | 3 | 4 | 5; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  };
  components: AirQualityComponents;
  dt: number;
}

export interface AirQualityComponents {
  co: number;      // Carbon monoxide (μg/m³)
  no: number;      // Nitrogen monoxide (μg/m³)
  no2: number;     // Nitrogen dioxide (μg/m³)
  o3: number;      // Ozone (μg/m³)
  so2: number;     // Sulphur dioxide (μg/m³)
  pm2_5: number;   // Fine particles (μg/m³)
  pm10: number;    // Coarse particles (μg/m³)
  nh3: number;     // Ammonia (μg/m³)
}

// AQI Level info for UI
export interface AQILevel {
  level: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}
