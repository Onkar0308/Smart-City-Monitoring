import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { fetchEnvironmentalData, type EnvironmentalData, getAqiCategory } from "@/services/aqi";
import { useCity } from "@/contexts/CityContext";

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

const timeRangeDescriptions = {
  daily: "24-hour pattern showing typical daily variations in air quality",
  weekly: "Recent 4-week trend showing day-to-day variations in air quality",
  monthly: "12-month view highlighting seasonal patterns in air quality",
  yearly: "5-year historical data showing long-term air quality improvements"
};

const defaultEnvData: EnvironmentalData = {
  current: {
    aqi: {
      value: 58,
      category: "Moderate"
    },
    temperature: 20,
    humidity: 45,
    co2: 65,
    timestamp: new Date().toISOString()
  },
  hourly: Array.from({ length: 9 }, (_, i) => ({
    hour: `${(i + 1).toString().padStart(2, '0')}:00`,
    aqi: {
      value: 50 + Math.floor(Math.random() * 20),
      category: "Moderate"
    },
    temperature: 20 + Math.floor(Math.random() * 5),
    humidity: 40 + Math.floor(Math.random() * 10),
    co2: 60 + Math.floor(Math.random() * 15)
  })),
  locationAverages: [
    { location: "thane", averageAqi: 55 },
    { location: "kalyan", averageAqi: 60 },
    { location: "andheri", averageAqi: 65 },
    { location: "borivali", averageAqi: 58 },
    { location: "virar", averageAqi: 52 },
    { location: "dadar", averageAqi: 63 },
    { location: "khargar", averageAqi: 57 }
  ],
  timeRangeAverages: {
    daily: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      averageAqi: 50 + Math.floor(Math.random() * 20)
    })),
    weekly: Array.from({ length: 4 }, (_, i) => ({
      week: `Week ${i + 1}`,
      averageAqi: 50 + Math.floor(Math.random() * 20)
    })),
    monthly: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      averageAqi: 50 + Math.floor(Math.random() * 20)
    })),
    yearly: Array.from({ length: 5 }, (_, i) => ({
      year: (2020 + i).toString(),
      averageAqi: 50 + Math.floor(Math.random() * 20)
    }))
  }
};

const getAqiColor = (value: number) => {
  if (value <= 50) return '#00E396';
  if (value <= 100) return '#FEB019';
  if (value <= 150) return '#FF4560';
  if (value <= 200) return '#775DD0';
  if (value <= 300) return '#FF1010';
  return '#7A0000';
};

export function EnvironmentalAnalytics() {
  const [envData, setEnvData] = useState<EnvironmentalData>(defaultEnvData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('daily');
  const { selectedCity } = useCity();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEnvironmentalData(selectedCity);
        setEnvData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch environmental data');
        console.error('Error fetching environmental data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const getTimeRangeData = () => {
    switch (selectedTimeRange) {
      case 'daily':
        return envData.timeRangeAverages.daily.map(d => ({
          period: d.hour,
          value: d.averageAqi
        }));
      case 'weekly':
        return envData.timeRangeAverages.weekly.map(d => ({
          period: d.week,
          value: d.averageAqi
        }));
      case 'monthly':
        return envData.timeRangeAverages.monthly.map(d => ({
          period: d.month,
          value: d.averageAqi
        }));
      case 'yearly':
        return envData.timeRangeAverages.yearly.map(d => ({
          period: d.year,
          value: d.averageAqi
        }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-semibold">Air Quality Index Trends</h3>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === 'daily'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTimeRange('daily')}
              >
                Daily
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === 'weekly'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTimeRange('weekly')}
              >
                Weekly
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTimeRange('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === 'yearly'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTimeRange('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            {timeRangeDescriptions[selectedTimeRange]}
          </div>

          <div className="h-[400px]">
            <ResponsiveBar
              data={getTimeRangeData()}
              keys={['value']}
              indexBy="period"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              colors={({ data }: { data: { value: number } }) => getAqiColor(data.value)}
              borderRadius={4}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: selectedTimeRange === 'daily' ? -45 : -45,
                tickValues: selectedTimeRange === 'daily' ? 12 : undefined // Show every other hour for daily view
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'AQI',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              tooltip={({ value, indexValue, color }) => (
                <div className="bg-white p-2 border rounded shadow-lg">
                  <strong>{indexValue}</strong>
                  <br />
                  <span style={{ color }}>AQI: {value}</span>
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current AQI with Prediction */}
        <Card className="p-6 relative">
          <h3 className="text-lg font-semibold mb-2">Current AQI</h3>
          <div className="text-3xl font-bold">{envData.current.aqi.value}</div>
          <div className="space-y-2">
            <div style={{ color: getAqiColor(envData.current.aqi.value) }}>
              {envData.current.aqi.category}
            </div>
            {envData.current.aqi.prediction && (
              <div className="flex items-center gap-2 text-sm">
                <span>Predicted:</span>
                <span style={{ color: getAqiColor(envData.current.aqi.prediction.predictedAQI) }}>
                  {envData.current.aqi.prediction.predictedAQI} AQI
                </span>
                <span className="text-gray-500">
                  ({Math.round(envData.current.aqi.prediction.confidence * 100)}% confidence)
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Updated {new Date(envData.current.timestamp).toLocaleTimeString()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Temperature</h3>
          <div className="text-3xl font-bold">{envData.current.temperature}°C</div>
          <div className="mt-2 text-green-500">Normal</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Humidity</h3>
          <div className="text-3xl font-bold">{envData.current.humidity.toFixed(2)}%</div>
          <div className="mt-2 text-green-500">Optimal</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">CO₂</h3>
          <div className="text-3xl font-bold">{envData.current.co2} ppm</div>
          <div className="mt-2 text-green-500">Normal</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location-wise AQI Comparison</h3>
        <div className="h-[400px]">
          <ResponsiveBar
            data={envData.locationAverages.map(loc => ({
              location: loc.location.charAt(0).toUpperCase() + loc.location.slice(1),
              value: loc.averageAqi
            }))}
            keys={['value']}
            indexBy="location"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            colors={({ data }: { data: { value: number } }) => getAqiColor(data.value)}
            borderRadius={4}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'AQI',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            tooltip={({ value, indexValue, color }) => (
              <div className="bg-white p-2 border rounded shadow-lg">
                <strong>{indexValue}</strong>
                <br />
                <span style={{ color }}>AQI: {value}</span>
              </div>
            )}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Temperature & Humidity Correlation</h3>
          <div className="h-[300px]">
            <ResponsiveLine
              data={[
                {
                  id: "temperature",
                  data: envData.hourly.map(h => ({
                    x: h.hour,
                    y: h.temperature
                  })),
                  color: "#FF4560"
                },
                {
                  id: "humidity",
                  data: envData.hourly.map(h => ({
                    x: h.hour,
                    y: h.humidity
                  })),
                  color: "#00E396"
                }
              ]}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Value",
                legendOffset: -40,
                legendPosition: "middle"
              }}
              pointSize={8}
              pointColor="#ffffff"
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={false}
              enableGridX={false}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateY: 40,
                  itemWidth: 100,
                  itemHeight: 20,
                  symbolSize: 10,
                  symbolShape: "circle"
                }
              ]}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">CO₂ Levels</h3>
          <div className="h-[300px]">
            <ResponsiveLine
              data={[
                {
                  id: "co2",
                  data: envData.hourly.map(h => ({
                    x: h.hour,
                    y: h.co2
                  }))
                }
              ]}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              curve="cardinal"
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "PPM",
                legendOffset: -40,
                legendPosition: "middle"
              }}
              enablePoints={true}
              pointSize={8}
              pointColor="#ffffff"
              pointBorderWidth={2}
              pointBorderColor="#6C5DD3"
              enableArea={true}
              areaOpacity={0.1}
              colors={["#6C5DD3"]}
              enableGridX={false}
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Environmental Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Air Quality Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Primary Pollutant</span>
                <span className="font-medium">PM2.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Daily Average</span>
                <span className="font-medium">{envData.current.aqi.value} AQI</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Peak Hours</span>
                <span className="font-medium">5:00 AM - 7:00 AM</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Optimal ventilation hours: 6 AM - 9 AM</li>
              <li>Plan activities based on current AQI levels</li>
              <li>Use air purifiers when needed</li>
              <li>Check AQI before outdoor activities</li>
              <li>Monitor humidity levels in enclosed spaces</li>
            </ul>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}