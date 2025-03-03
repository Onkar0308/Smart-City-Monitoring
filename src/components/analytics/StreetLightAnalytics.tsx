import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useCity } from "@/contexts/CityContext";

interface StreetLightData {
  current: {
    totalLights: number;
    activeLights: number;
    faultyLights: number;
    energyConsumption: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    activeLights: number;
    energyConsumption: number;
  }>;
  zones: Array<{
    name: string;
    totalLights: number;
    activeLights: number;
    faultyLights: number;
    energyConsumption: number;
  }>;
  faultTypes: Array<{
    type: string;
    count: number;
  }>;
}

export function StreetLightAnalytics() {
  const [lightData, setLightData] = useState<StreetLightData>({
    current: {
      totalLights: 1000,
      activeLights: 980,
      faultyLights: 20,
      energyConsumption: 450,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      activeLights: 900 + Math.floor(Math.random() * 100),
      energyConsumption: 400 + Math.floor(Math.random() * 100)
    })),
    zones: [
      { name: "Zone A", totalLights: 250, activeLights: 245, faultyLights: 5, energyConsumption: 112.5 },
      { name: "Zone B", totalLights: 300, activeLights: 294, faultyLights: 6, energyConsumption: 135.0 },
      { name: "Zone C", totalLights: 200, activeLights: 196, faultyLights: 4, energyConsumption: 90.0 },
      { name: "Zone D", totalLights: 250, activeLights: 245, faultyLights: 5, energyConsumption: 112.5 }
    ],
    faultTypes: [
      { type: "Bulb Failure", count: 8 },
      { type: "Power Supply", count: 5 },
      { type: "Wiring Issue", count: 4 },
      { type: "Control System", count: 3 }
    ]
  });
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Lights</h3>
          <div className="text-3xl font-bold">{lightData.current.totalLights}</div>
          <div className="mt-2 text-blue-500">Installed</div>
          <div className="mt-4 text-sm text-gray-500">
            Updated {new Date(lightData.current.timestamp).toLocaleTimeString()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Lights</h3>
          <div className="text-3xl font-bold">{lightData.current.activeLights}</div>
          <div className="mt-2 text-green-500">Operational</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Faulty Lights</h3>
          <div className="text-3xl font-bold">{lightData.current.faultyLights}</div>
          <div className="mt-2 text-red-500">Needs Attention</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Energy Usage</h3>
          <div className="text-3xl font-bold">{lightData.current.energyConsumption} kWh</div>
          <div className="mt-2 text-amber-500">Peak Hours</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hourly Energy Consumption</h3>
        <div className="h-[300px]">
          <ResponsiveLine
            data={[
              {
                id: "energy",
                data: lightData.hourly.map(h => ({
                  x: h.hour,
                  y: h.energyConsumption
                }))
              }
            ]}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
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
              legend: "Energy Consumption (kWh)",
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
        <h3 className="text-lg font-semibold mb-4">Zone-wise Light Status</h3>
        <div className="h-[300px]">
          <ResponsiveBar
            data={lightData.zones.map(zone => ({
              name: zone.name,
              active: zone.activeLights,
              faulty: zone.faultyLights
            }))}
            keys={['active', 'faulty']}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="stacked"
            colors={['#00E396', '#FF4560']}
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
              legend: 'Number of Lights',
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fault Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveBar
              data={lightData.faultTypes}
              keys={['count']}
              indexBy="type"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              colors="#FF4560"
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
                legend: 'Number of Faults',
                legendPosition: 'middle',
                legendOffset: -40
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Status</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>98% lights operational across zones</li>
                <li>Bulb failures most common issue</li>
                <li>Energy consumption within normal range</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Schedule maintenance for Zone B</li>
                <li>Investigate power supply issues</li>
                <li>Monitor energy usage patterns</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}