import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useCity } from "@/contexts/CityContext";
import { fetchTrafficData, type LocationTrafficData } from "@/services/traffic";

interface TrafficData {
  current: {
    congestionLevel: number;
    averageSpeed: number;
    vehicleCount: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    congestionLevel: number;
    averageSpeed: number;
    vehicleCount: number;
  }>;
  junctions: Array<{
    name: string;
    congestionLevel: number;
    vehicleCount: number;
  }>;
}

// Convert service data to component format
const convertTrafficData = (data: LocationTrafficData): TrafficData => {
  // Calculate congestion level based on vehicle count (0-100%)
  const maxVehicles = Math.max(...data.hourlyData.map(h => h.vehicleCount));
  const getCongestionLevel = (count: number) => Math.min(100, Math.round((count / maxVehicles) * 100));
  
  // Calculate average speed (inverse relationship with congestion)
  const getSpeed = (congestion: number) => Math.max(10, Math.round(60 - (congestion * 0.5)));

  // Generate junction names based on location
  const junctionPrefixes: Record<string, string[]> = {
    "Thane": ["Eastern Express", "LBS Marg", "Ghodbunder", "Pokhran"],
    "Borivali": ["Western Express", "SV Road", "Link Road", "Station"],
    "Kalyan": ["Birla College", "Station Road", "Shil Phata", "Kalyan-Shilphata"]
  };

  const prefixes = junctionPrefixes[data.location] || ["Junction 1", "Junction 2", "Junction 3", "Junction 4"];

  return {
    current: {
      congestionLevel: getCongestionLevel(data.currentTraffic.vehicleCount),
      averageSpeed: getSpeed(getCongestionLevel(data.currentTraffic.vehicleCount)),
      vehicleCount: data.currentTraffic.vehicleCount,
      timestamp: data.currentTraffic.timestamp
    },
    hourly: data.hourlyData.map(h => {
      const congestion = getCongestionLevel(h.vehicleCount);
      return {
        hour: h.hour,
        congestionLevel: congestion,
        averageSpeed: getSpeed(congestion),
        vehicleCount: h.vehicleCount
      };
    }),
    junctions: prefixes.map((name, i) => ({
      name: `${name} Junction`,
      congestionLevel: getCongestionLevel(data.currentTraffic.vehicleCount * (1 + (i * 0.2 - 0.3))),
      vehicleCount: Math.round(data.currentTraffic.vehicleCount * (1 + (i * 0.2 - 0.3)))
    }))
  };
};

export function TrafficAnalytics() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedCity } = useCity();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTrafficData(selectedCity);
        if (!Array.isArray(data)) {
          setTrafficData(convertTrafficData(data));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch traffic data');
        console.error('Error fetching traffic data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (isLoading) {
    return <div>Loading traffic data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!trafficData) {
    return <div>No traffic data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Congestion Level</h3>
          <div className="text-3xl font-bold">{trafficData.current.congestionLevel}%</div>
          <div className="mt-2 text-amber-500">Moderate</div>
          <div className="mt-4 text-sm text-gray-500">
            Updated {new Date(trafficData.current.timestamp).toLocaleTimeString()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Speed</h3>
          <div className="text-3xl font-bold">{trafficData.current.averageSpeed} km/h</div>
          <div className="mt-2 text-green-500">Normal Flow</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Vehicle Count</h3>
          <div className="text-3xl font-bold">{trafficData.current.vehicleCount}</div>
          <div className="mt-2 text-amber-500">Peak Hours</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hourly Traffic Flow</h3>
        <div className="h-[300px]">
          <ResponsiveLine
            data={[
              {
                id: "congestion",
                data: trafficData.hourly.map(h => ({
                  x: h.hour,
                  y: h.congestionLevel
                }))
              }
            ]}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: 100 }}
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
              legend: "Congestion Level (%)",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            enablePoints={true}
            pointSize={8}
            pointColor="#ffffff"
            pointBorderWidth={2}
            pointBorderColor="#FF4560"
            enableArea={true}
            areaOpacity={0.1}
            colors={["#FF4560"]}
            enableGridX={false}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Junction-wise Traffic Status</h3>
        <div className="h-[300px]">
          <ResponsiveBar
            data={trafficData.junctions}
            keys={['congestionLevel']}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={({ data }) => {
              const level = data.congestionLevel as number;
              if (level <= 40) return '#00E396';
              if (level <= 70) return '#FEB019';
              return '#FF4560';
            }}
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
              legend: 'Congestion Level (%)',
              legendPosition: 'middle',
              legendOffset: -40
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Speed vs Vehicle Count</h3>
          <div className="h-[300px]">
            <ResponsiveLine
              data={[
                {
                  id: "speed",
                  data: trafficData.hourly.map(h => ({
                    x: h.hour,
                    y: h.averageSpeed
                  })),
                  color: "#775DD0"
                },
                {
                  id: "vehicles",
                  data: trafficData.hourly.map(h => ({
                    x: h.hour,
                    y: h.vehicleCount / 10 // Scale down for better visualization
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
              pointBorderColor={{ from: "color" }}
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
          <h3 className="text-lg font-semibold mb-4">Traffic Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Status</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Moderate congestion levels across major junctions</li>
                <li>Average speed within normal range</li>
                <li>Vehicle count indicating peak hour traffic</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Consider alternate routes around {trafficData.junctions.find(j => j.congestionLevel > 70)?.name || 'congested areas'}</li>
                <li>Expect delays during evening rush hours</li>
                <li>Monitor real-time updates for route optimization</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}