import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useCity } from "@/contexts/CityContext";

interface ParkingData {
  current: {
    totalSpaces: number;
    occupiedSpaces: number;
    occupancyRate: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    occupiedSpaces: number;
    occupancyRate: number;
  }>;
  locations: Array<{
    name: string;
    totalSpaces: number;
    occupiedSpaces: number;
    occupancyRate: number;
  }>;
}

export function ParkingAnalytics() {
  const [parkingData, setParkingData] = useState<ParkingData>({
    current: {
      totalSpaces: 1000,
      occupiedSpaces: 750,
      occupancyRate: 75,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      occupiedSpaces: 500 + Math.floor(Math.random() * 400),
      occupancyRate: 50 + Math.floor(Math.random() * 40)
    })),
    locations: [
      { name: "Central Parking", totalSpaces: 300, occupiedSpaces: 285, occupancyRate: 95 },
      { name: "Mall Parking", totalSpaces: 400, occupiedSpaces: 280, occupancyRate: 70 },
      { name: "Station Parking", totalSpaces: 200, occupiedSpaces: 140, occupancyRate: 70 },
      { name: "Market Parking", totalSpaces: 100, occupiedSpaces: 45, occupancyRate: 45 }
    ]
  });
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Spaces</h3>
          <div className="text-3xl font-bold">{parkingData.current.totalSpaces}</div>
          <div className="mt-2 text-blue-500">Available</div>
          <div className="mt-4 text-sm text-gray-500">
            Updated {new Date(parkingData.current.timestamp).toLocaleTimeString()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Occupied Spaces</h3>
          <div className="text-3xl font-bold">{parkingData.current.occupiedSpaces}</div>
          <div className="mt-2 text-amber-500">High Occupancy</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Occupancy Rate</h3>
          <div className="text-3xl font-bold">{parkingData.current.occupancyRate}%</div>
          <div className="mt-2 text-amber-500">Peak Hours</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hourly Occupancy Trend</h3>
        <div className="h-[300px]">
          <ResponsiveLine
            data={[
              {
                id: "occupancy",
                data: parkingData.hourly.map(h => ({
                  x: h.hour,
                  y: h.occupancyRate
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
              legend: "Occupancy Rate (%)",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            enablePoints={true}
            pointSize={8}
            pointColor="#ffffff"
            pointBorderWidth={2}
            pointBorderColor="#00E396"
            enableArea={true}
            areaOpacity={0.1}
            colors={["#00E396"]}
            enableGridX={false}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location-wise Occupancy</h3>
        <div className="h-[300px]">
          <ResponsiveBar
            data={parkingData.locations}
            keys={['occupancyRate']}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={({ data }) => {
              const rate = data.occupancyRate as number;
              if (rate <= 50) return '#00E396';
              if (rate <= 80) return '#FEB019';
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
              legend: 'Occupancy Rate (%)',
              legendPosition: 'middle',
              legendOffset: -40
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Space Utilization</h3>
          <div className="h-[300px]">
            <ResponsiveBar
              data={parkingData.locations.map(loc => ({
                name: loc.name,
                occupied: loc.occupiedSpaces,
                available: loc.totalSpaces - loc.occupiedSpaces
              }))}
              keys={['occupied', 'available']}
              indexBy="name"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="stacked"
              colors={['#FF4560', '#00E396']}
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
                legend: 'Number of Spaces',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateY: 40,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  symbolSize: 10
                }
              ]}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Parking Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Status</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>High occupancy at Central Parking</li>
                <li>Moderate availability at Mall Parking</li>
                <li>Good availability at Market Parking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Consider Market Parking for longer stays</li>
                <li>Peak hours expected between 2 PM - 6 PM</li>
                <li>Check real-time updates before arrival</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}