import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { TrendingUp, Droplets, Wind, ThermometerSun } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { formatTemp } from '@/lib/utils'

/**
 * Custom tooltip component for charts
 */
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  
  return (
    <div className="glass rounded-lg p-3 shadow-xl border border-storm-600">
      <p className="text-sm font-medium text-storm-100 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-storm-300">
            {entry.dataKey === 'temp' && 'Temperature'}
            {entry.dataKey === 'humidity' && 'Humidity'}
            {entry.dataKey === 'wind' && 'Wind'}
            {entry.dataKey === 'pop' && 'Precipitation'}
            : 
          </span>
          <span className="font-medium text-storm-100">
            {entry.dataKey === 'temp' && `${entry.value}°`}
            {entry.dataKey === 'humidity' && `${entry.value}%`}
            {entry.dataKey === 'wind' && `${entry.value} m/s`}
            {entry.dataKey === 'pop' && `${Math.round(entry.value * 100)}%`}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Temperature Chart Component
 * Shows temperature trend for the next 24 hours
 */
export function TemperatureChart() {
  const { forecast, unit } = useWeatherStore()
  
  // Process forecast data for chart (next 24 hours = 8 data points)
  const chartData = useMemo(() => {
    if (!forecast?.list) return []
    
    return forecast.list.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000)
      const hours = date.getHours()
      const timeLabel = hours === 0 ? '12 AM' : 
                       hours === 12 ? '12 PM' : 
                       hours > 12 ? `${hours - 12} PM` : `${hours} AM`
      
      return {
        time: timeLabel,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 10) / 10
      }
    })
  }, [forecast])
  
  if (!chartData.length) return null
  
  return (
    <div className="glass-card animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-weather-500/20">
          <TrendingUp className="w-5 h-5 text-weather-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-storm-50">
            Temperature Trend
          </h3>
          <p className="text-sm text-storm-400">
            Next 24 hours forecast
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155"
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-storm-300 text-sm">
                  {value === 'temp' ? 'Temperature' : 'Feels Like'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#tempGradient)"
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="feelsLike"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#feelsLikeGradient)"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-storm-700">
        <div className="text-center">
          <p className="text-xs text-storm-400 mb-1">Min</p>
          <p className="text-lg font-bold text-weather-500">
            {formatTemp(Math.min(...chartData.map(d => d.temp)), unit)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-storm-400 mb-1">Max</p>
          <p className="text-lg font-bold text-sunny-500">
            {formatTemp(Math.max(...chartData.map(d => d.temp)), unit)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-storm-400 mb-1">Avg</p>
          <p className="text-lg font-bold text-storm-100">
            {formatTemp(Math.round(chartData.reduce((a, b) => a + b.temp, 0) / chartData.length), unit)}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Weather Conditions Chart Component
 * Shows humidity, wind, and precipitation probability
 */
export function WeatherConditionsChart() {
  const { forecast } = useWeatherStore()
  
  // Process forecast data for chart
  const chartData = useMemo(() => {
    if (!forecast?.list) return []
    
    return forecast.list.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000)
      const hours = date.getHours()
      const timeLabel = hours === 0 ? '12 AM' : 
                       hours === 12 ? '12 PM' : 
                       hours > 12 ? `${hours - 12} PM` : `${hours} AM`
      
      return {
        time: timeLabel,
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 10) / 10,
        pop: item.pop
      }
    })
  }, [forecast])
  
  if (!chartData.length) return null
  
  return (
    <div className="glass-card animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-weather-500/20">
          <Droplets className="w-5 h-5 text-weather-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-storm-50">
            Weather Conditions
          </h3>
          <p className="text-sm text-storm-400">
            Humidity, Wind & Precipitation
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155"
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-storm-300 text-sm">
                  {value === 'humidity' ? 'Humidity' : value === 'pop' ? 'Rain Chance' : 'Wind'}
                </span>
              )}
            />
            <Bar dataKey="humidity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pop" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-storm-700">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-weather-400" />
          <div>
            <p className="text-xs text-storm-400">Avg Humidity</p>
            <p className="font-bold text-storm-100">
              {Math.round(chartData.reduce((a, b) => a + b.humidity, 0) / chartData.length)}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-xs text-storm-400">Avg Wind</p>
            <p className="font-bold text-storm-100">
              {(chartData.reduce((a, b) => a + b.wind, 0) / chartData.length).toFixed(1)} m/s
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThermometerSun className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-xs text-storm-400">Rain Chance</p>
            <p className="font-bold text-storm-100">
              {Math.round(Math.max(...chartData.map(d => d.pop)) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
