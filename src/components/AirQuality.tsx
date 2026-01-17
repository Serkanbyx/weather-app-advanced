import { Wind, AlertTriangle, Leaf, Factory, Droplets } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { cn } from '@/lib/utils'
import type { AQILevel } from '@/types/weather'

/**
 * AQI level configurations
 * Based on OpenWeather Air Pollution API levels (1-5)
 */
const aqiLevels: Record<number, AQILevel> = {
  1: {
    level: 1,
    label: 'Good',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20'
  },
  2: {
    level: 2,
    label: 'Fair',
    description: 'Air quality is acceptable. Some pollutants may pose a moderate health concern.',
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/20'
  },
  3: {
    level: 3,
    label: 'Moderate',
    description: 'Members of sensitive groups may experience health effects.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  4: {
    level: 4,
    label: 'Poor',
    description: 'Everyone may begin to experience health effects.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  5: {
    level: 5,
    label: 'Very Poor',
    description: 'Health warnings of emergency conditions. Everyone is more likely to be affected.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20'
  }
}

/**
 * Get AQI level info
 */
function getAqiLevel(aqi: number): AQILevel {
  return aqiLevels[aqi] || aqiLevels[3]
}

/**
 * Format pollutant value with unit
 */
function formatPollutant(value: number, unit: string = 'μg/m³'): string {
  return `${value.toFixed(1)} ${unit}`
}

/**
 * Air Quality Card Component
 * Displays air quality index and pollutant levels
 */
export function AirQuality() {
  const { airQuality } = useWeatherStore()
  
  // Guard clause: Return null if no air quality data
  if (!airQuality?.list?.[0]) {
    return null
  }
  
  const { main, components } = airQuality.list[0]
  const aqiInfo = getAqiLevel(main.aqi)
  
  // Main pollutants to display
  const pollutants = [
    { 
      icon: Droplets,
      label: 'PM2.5', 
      value: components.pm2_5,
      description: 'Fine particles'
    },
    { 
      icon: Wind,
      label: 'PM10', 
      value: components.pm10,
      description: 'Coarse particles'
    },
    { 
      icon: Factory,
      label: 'NO₂', 
      value: components.no2,
      description: 'Nitrogen dioxide'
    },
    { 
      icon: Leaf,
      label: 'O₃', 
      value: components.o3,
      description: 'Ozone'
    },
    { 
      icon: Factory,
      label: 'SO₂', 
      value: components.so2,
      description: 'Sulphur dioxide'
    },
    { 
      icon: Factory,
      label: 'CO', 
      value: components.co,
      description: 'Carbon monoxide'
    }
  ]
  
  return (
    <div className="glass-card animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', aqiInfo.bgColor)}>
            <Wind className={cn('w-5 h-5', aqiInfo.color)} />
          </div>
          <div>
            <h3 className="font-display font-bold text-storm-50">
              Air Quality Index
            </h3>
            <p className="text-sm text-storm-400">
              Current air pollution levels
            </p>
          </div>
        </div>
        
        {/* AQI Badge */}
        <div className={cn(
          'px-4 py-2 rounded-xl font-bold text-lg',
          aqiInfo.bgColor,
          aqiInfo.color
        )}>
          {main.aqi} - {aqiInfo.label}
        </div>
      </div>
      
      {/* AQI Description */}
      <div className={cn(
        'flex items-start gap-3 p-4 rounded-xl mb-6',
        aqiInfo.bgColor
      )}>
        <AlertTriangle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', aqiInfo.color)} />
        <p className={cn('text-sm', aqiInfo.color)}>
          {aqiInfo.description}
        </p>
      </div>
      
      {/* AQI Scale */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-storm-400 mb-2">
          <span>Good</span>
          <span>Very Poor</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 relative">
          {/* Indicator */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-storm-900 border-2 border-white shadow-lg transition-all"
            style={{ left: `${((main.aqi - 1) / 4) * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
      
      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pollutants.map((pollutant, index) => (
          <div
            key={pollutant.label}
            className={cn(
              'bg-storm-700/30 rounded-xl p-3 transition-all duration-200',
              'hover:bg-storm-700/50 animate-fade-in'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 text-storm-400 mb-1">
              <pollutant.icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{pollutant.label}</span>
            </div>
            <p className="text-base font-semibold text-storm-100">
              {formatPollutant(pollutant.value)}
            </p>
            <p className="text-xs text-storm-500">
              {pollutant.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
