import { CloudRain } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { 
  processForecast, 
  formatTemp, 
  getWeatherIconUrl,
  cn 
} from '@/lib/utils'
import type { ProcessedForecast } from '@/types/weather'

/**
 * Forecast Item Component
 */
interface ForecastItemProps {
  day: ProcessedForecast
  index: number
  unit: 'metric' | 'imperial'
}

function ForecastItem({ day, index, unit }: ForecastItemProps) {
  const isToday = day.dayName === 'Today'
  
  return (
    <div 
      className={cn(
        'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
        'hover:bg-storm-700/50',
        isToday ? 'bg-weather-500/10 border border-weather-500/30' : 'bg-storm-700/30',
        'animate-slide-up'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Day name */}
      <div className="w-20">
        <p className={cn(
          'font-semibold',
          isToday ? 'text-weather-400' : 'text-storm-200'
        )}>
          {day.dayName}
        </p>
        <p className="text-xs text-storm-400">
          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      
      {/* Weather icon */}
      <div className="flex items-center gap-2">
        <img 
          src={getWeatherIconUrl(day.weather.icon, '2x')} 
          alt={day.weather.description}
          className="w-12 h-12 weather-icon"
        />
      </div>
      
      {/* Precipitation chance */}
      <div className="flex items-center gap-1 w-16">
        {day.pop > 0 && (
          <>
            <CloudRain className="w-4 h-4 text-weather-400" />
            <span className="text-sm text-weather-400 font-medium">
              {Math.round(day.pop * 100)}%
            </span>
          </>
        )}
      </div>
      
      {/* Temperature range */}
      <div className="flex items-center gap-3 w-32 justify-end">
        <span className="font-semibold text-storm-100">
          {formatTemp(day.temp.max, unit)}
        </span>
        
        {/* Temperature bar */}
        <div className="w-16 h-1.5 bg-storm-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-weather-500 to-sunny-400 rounded-full"
            style={{ 
              width: `${Math.min(100, Math.max(20, ((day.temp.max - day.temp.min) / 20) * 100))}%` 
            }}
          />
        </div>
        
        <span className="text-storm-400 text-sm">
          {formatTemp(day.temp.min, unit)}
        </span>
      </div>
    </div>
  )
}

/**
 * 5-Day Forecast Component
 */
export function Forecast() {
  const { forecast, unit } = useWeatherStore()
  
  // Guard clause: Return null if forecast data is invalid
  if (!forecast?.list || !Array.isArray(forecast.list) || forecast.list.length === 0) {
    return null
  }
  
  const processedForecast = processForecast(forecast)
  
  // Return null if no processed data
  if (processedForecast.length === 0) return null
  
  return (
    <div className="glass-card animate-slide-up animation-delay-200">
      <h3 className="text-xl font-display font-bold text-storm-100 mb-6">
        5-Day Forecast
      </h3>
      
      <div className="space-y-2">
        {processedForecast.map((day, index) => (
          <ForecastItem 
            key={day.date} 
            day={day} 
            index={index}
            unit={unit}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Hourly Forecast Preview Component (shows next 8 items from API)
 */
export function HourlyForecastPreview() {
  const { forecast, unit } = useWeatherStore()
  
  // Guard clause: Return null if forecast data is invalid
  if (!forecast?.list || !Array.isArray(forecast.list) || forecast.list.length === 0) {
    return null
  }
  
  const hourlyItems = forecast.list.slice(0, 8)
  
  return (
    <div className="glass-card animate-slide-up animation-delay-100">
      <h3 className="text-xl font-display font-bold text-storm-100 mb-6">
        Hourly Forecast
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {hourlyItems.map((item, index) => {
          // Skip items with missing weather data
          if (!item?.weather?.[0] || !item?.main) return null
          
          const time = new Date(item.dt * 1000)
          const isNow = index === 0
          const weatherData = item.weather[0]
          
          return (
            <div 
              key={item.dt}
              className={cn(
                'flex-shrink-0 flex flex-col items-center p-4 rounded-xl transition-all',
                isNow ? 'bg-weather-500/20 border border-weather-500/30' : 'bg-storm-700/30',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className={cn(
                'text-sm font-medium mb-2',
                isNow ? 'text-weather-400' : 'text-storm-400'
              )}>
                {isNow ? 'Now' : time.toLocaleTimeString('en-US', { 
                  hour: 'numeric',
                  hour12: true 
                })}
              </span>
              
              <img 
                src={getWeatherIconUrl(weatherData.icon, '2x')} 
                alt={weatherData.description}
                className="w-10 h-10 weather-icon"
              />
              
              <span className="font-semibold text-storm-100 mt-1">
                {formatTemp(item.main.temp, unit)}
              </span>
              
              {(item.pop ?? 0) > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <CloudRain className="w-3 h-3 text-weather-400" />
                  <span className="text-xs text-weather-400">
                    {Math.round((item.pop ?? 0) * 100)}%
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
