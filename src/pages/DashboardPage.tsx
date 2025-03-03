import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/metrics/MetricCard";
import { ResponsiveBar, BarDatum } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Lightbulb, Car, Wind, Activity } from 'lucide-react';
import { DashboardMapView } from '@/components/analytics/DashboardMapView';
import { fetchEnvironmentalData, getAqiCategory } from '@/services/aqi';
import { useCity } from '@/contexts/CityContext';
import { fetchParkingData } from '@/services/parking';

interface AqiDataPoint extends BarDatum {
  label: string;
  value: number;
  category: string;
  [key: string]: string | number;
}

interface TooltipProps {
  id: string | number;
  value: number;
  color: string;
}

const getAqiColor = (value: number) => {
  if (value <= 50) return '#00E396';
  if (value <= 100) return '#FEB019';
  if (value <= 150) return '#FF4560';
  if (value <= 200) return '#775DD0';
  if (value <= 300) return '#FF1010';
  return '#7A0000';
};

export function DashboardPage() {
  const { selectedCity } = useCity();
  const [activeTab, setActiveTab] = useState("DAY");
  const [aqiData, setAqiData] = useState<AqiDataPoint[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [parkingData, setParkingData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [envData, parkData] = await Promise.all([
          fetchEnvironmentalData(selectedCity),
          fetchParkingData(selectedCity)
        ]);
        
        setEnvironmentalData(envData);
        setParkingData([
          { id: "Available", value: parkData.current.availableSpots, color: "#00E396" },
          { id: "Occupied", value: parkData.current.occupiedSpots, color: "#FF4560" }
        ]);

        let timeData: AqiDataPoint[] = [];
        switch (activeTab) {
          case "DAY":
            timeData = envData.timeRangeAverages.daily.map((item: { hour: string; averageAqi: number }) => ({
              label: item.hour,
              value: item.averageAqi,
              category: getAqiCategory(item.averageAqi)
            }));
            break;
          case "WK":
            timeData = envData.timeRangeAverages.weekly.map((item: { week: string; averageAqi: number }) => ({
              label: item.week,
              value: item.averageAqi,
              category: getAqiCategory(item.averageAqi)
            }));
            break;
          case "MO":
            timeData = envData.timeRangeAverages.monthly.map((item: { month: string; averageAqi: number }) => ({
              label: item.month,
              value: item.averageAqi,
              category: getAqiCategory(item.averageAqi)
            }));
            break;
          case "YR":
            timeData = envData.timeRangeAverages.yearly.map((item: { year: string; averageAqi: number }) => ({
              label: item.year,
              value: item.averageAqi,
              category: getAqiCategory(item.averageAqi)
            }));
            break;
        }
        setAqiData(timeData);
      } catch (error) {
        console.error('Error fetching environmental data:', error);
      }
    };

    fetchData();
  }, [activeTab, selectedCity]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Lightbulb className="h-8 w-8 text-[#6C5DD3]" />}
          title="Total lights"
          value="1128"
          details={[
            { label: "Functioning", value: "986" },
            { label: "Not functioning", value: "142" },
          ]}
          analyticsSection="lights"
        />

        <MetricCard
          icon={<Activity className="h-8 w-8 text-[#6C5DD3]" />}
          title="Traffic Flow"
          value="2,450"
          subtitle="Vehicles/hour"
          details={[
            { label: "Peak hours", value: "3,200" },
            { label: "Off-peak", value: "1,800" },
          ]}
          analyticsSection="traffic"
        />

        <MetricCard
          icon={<Car className="h-8 w-8 text-[#6C5DD3]" />}
          title="Parking Status"
          value={parkingData ? parkingData[0].value + parkingData[1].value : '0'}
          subtitle="Total spots"
          details={[
            { label: "Available", value: parkingData ? parkingData[0].value.toString() : '0' },
            { label: "Occupied", value: parkingData ? parkingData[1].value.toString() : '0' },
          ]}
          analyticsSection="parking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Graph */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold">Air Quality Index</h3>
              <p className="text-sm text-gray-500 mt-1">
                Current AQI: {environmentalData?.current.aqi.value} ({environmentalData?.current.aqi.category})
              </p>
            </div>
            <div className="flex items-center bg-[#F4F7FE] rounded-lg p-1">
              {[
                { id: "DAY", label: "24H" },
                { id: "WK", label: "Week" },
                { id: "MO", label: "Month" },
                { id: "YR", label: "Year" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#6C5DD3] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveBar<AqiDataPoint>
              data={aqiData}
              keys={['value']}
              indexBy="label"
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={({ data }) => getAqiColor(data.value)}
              borderRadius={4}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'AQI',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              role="application"
              tooltip={({ id, value, color }: TooltipProps) => (
                <div
                  style={{
                    padding: 12,
                    background: '#ffffff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <strong style={{ color }}>
                    AQI: {value}
                  </strong>
                  <br />
                  <span>
                    {value <= 50 ? 'Good' :
                     value <= 100 ? 'Moderate' :
                     value <= 150 ? 'Unhealthy for Sensitive Groups' :
                     value <= 200 ? 'Unhealthy' :
                     value <= 300 ? 'Very Unhealthy' : 'Hazardous'}
                  </span>
                </div>
              )}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: 12,
                      fill: "#6B7280"
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: "#E5E7EB",
                    strokeWidth: 1
                  }
                }
              }}
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00E396' }} />
              <span className="text-sm text-gray-600">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEB019' }} />
              <span className="text-sm text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF4560' }} />
              <span className="text-sm text-gray-600">Unhealthy</span>
            </div>
          </div>
        </Card>

        {/* Live Traffic Map */}
        <DashboardMapView />
      </div>

      {/* Environmental Data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Environmental data</h3>
          <button 
            className="text-sm text-[#6C5DD3] hover:underline"
            onClick={() => window.location.href = '/analytics?section=environmental'}
          >
            Read more
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#6C5DD3]" />
               <div className="text-sm text-gray-500">Temperature</div>
             </div>
             <div className="text-2xl font-semibold">{environmentalData?.current.temperature}°C</div>
           </div>
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#6C5DD3]" />
               <div className="text-sm text-gray-500">AQI</div>
             </div>
             <div className="text-2xl font-semibold">{environmentalData?.current.aqi.value}</div>
           </div>
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#6C5DD3]" />
               <div className="text-sm text-gray-500">Humidity</div>
             </div>
             <div className="text-2xl font-semibold">{environmentalData?.current.humidity}%</div>
           </div>
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#6C5DD3]" />
               <div className="text-sm text-gray-500">CO₂</div>
             </div>
             <div className="text-2xl font-semibold">{environmentalData?.current.co2} ppm</div>
           </div>
         </div>
     </Card>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Parking Occupancy */}
       <Card className="p-6 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Parking occupancy</h3>
            <button 
              className="text-sm text-[#6C5DD3] hover:underline"
              onClick={() => window.location.href = '/analytics?section=parking'}
            >
              Read more
            </button>
          </div>
          <div className="h-[200px]">
            <ResponsivePie
              data={parkingData || []}
              margin={{ top: 10, right: 10, bottom: 50, left: 10 }}
              innerRadius={0.6}
              padAngle={0.5}
              cornerRadius={3}
              colors={{ datum: 'data.color' }}
              enableArcLinkLabels={false}
              enableArcLabels={false}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateY: 40,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#6B7280',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 10,
                  symbolShape: 'circle'
                }
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}