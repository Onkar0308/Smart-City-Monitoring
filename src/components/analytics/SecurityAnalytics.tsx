import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useCity } from "@/contexts/CityContext";

interface SecurityData {
  current: {
    activeAlerts: number;
    activeCameras: number;
    incidentCount: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    alertCount: number;
    incidentCount: number;
  }>;
  zones: Array<{
    name: string;
    activeCameras: number;
    alertCount: number;
    incidentCount: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  }>;
  incidentTypes: Array<{
    type: string;
    count: number;
  }>;
}

export function SecurityAnalytics() {
  const [securityData, setSecurityData] = useState<SecurityData>({
    current: {
      activeAlerts: 5,
      activeCameras: 120,
      incidentCount: 12,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      alertCount: Math.floor(Math.random() * 10),
      incidentCount: Math.floor(Math.random() * 5)
    })),
    zones: [
      { name: "Zone A", activeCameras: 30, alertCount: 2, incidentCount: 3, riskLevel: 'Medium' },
      { name: "Zone B", activeCameras: 25, alertCount: 1, incidentCount: 2, riskLevel: 'Low' },
      { name: "Zone C", activeCameras: 35, alertCount: 4, incidentCount: 5, riskLevel: 'High' },
      { name: "Zone D", activeCameras: 30, alertCount: 1, incidentCount: 2, riskLevel: 'Low' }
    ],
    incidentTypes: [
      { type: "Suspicious Activity", count: 5 },
      { type: "Traffic Violation", count: 3 },
      { type: "Public Safety", count: 2 },
      { type: "Emergency", count: 2 }
    ]
  });
  const { selectedCity } = useCity();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Alerts</h3>
          <div className="text-3xl font-bold">{securityData.current.activeAlerts}</div>
          <div className="mt-2 text-amber-500">Requires Attention</div>
          <div className="mt-4 text-sm text-gray-500">
            Updated {new Date(securityData.current.timestamp).toLocaleTimeString()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Cameras</h3>
          <div className="text-3xl font-bold">{securityData.current.activeCameras}</div>
          <div className="mt-2 text-green-500">All Systems Operational</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Incidents</h3>
          <div className="text-3xl font-bold">{securityData.current.incidentCount}</div>
          <div className="mt-2 text-amber-500">Last 24 Hours</div>
          <div className="mt-4 text-sm text-gray-500">Updated now</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hourly Alert Trend</h3>
        <div className="h-[300px]">
          <ResponsiveLine
            data={[
              {
                id: "alerts",
                data: securityData.hourly.map(h => ({
                  x: h.hour,
                  y: h.alertCount
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
              legend: "Number of Alerts",
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
        <h3 className="text-lg font-semibold mb-4">Zone-wise Security Status</h3>
        <div className="h-[300px]">
          <ResponsiveBar
            data={securityData.zones}
            keys={['incidentCount']}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={({ data }) => {
              switch (data.riskLevel) {
                case 'Low': return '#00E396';
                case 'Medium': return '#FEB019';
                case 'High': return '#FF4560';
                default: return '#999999';
              }
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
              legend: 'Incident Count',
              legendPosition: 'middle',
              legendOffset: -40
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Incident Types</h3>
          <div className="h-[300px]">
            <ResponsiveBar
              data={securityData.incidentTypes}
              keys={['count']}
              indexBy="type"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              colors="#6C5DD3"
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
                legend: 'Number of Incidents',
                legendPosition: 'middle',
                legendOffset: -40
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Status</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>High alert level in Zone C</li>
                <li>All surveillance systems operational</li>
                <li>Multiple incidents under investigation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Increase patrols in Zone C</li>
                <li>Monitor suspicious activities in Zone A</li>
                <li>Regular system maintenance scheduled</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}