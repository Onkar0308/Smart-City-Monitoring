import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Bell, Clock, AlertOctagon } from "lucide-react";
import { ResponsiveLine } from "@nivo/line";

// Thresholds for different metrics
const THRESHOLDS = {
  traffic: {
    red: 3000, // vehicles/hour
    yellow: 2500,
    green: 1500
  },
  aqi: {
    red: 150, // AQI value
    yellow: 100,
    green: 50
  },
  co2: {
    red: 1000, // ppm
    yellow: 800,
    green: 600
  },
  temperature: {
    red: 35, // °C
    yellow: 30,
    green: 25
  },
  humidity: {
    red: 80, // %
    yellow: 70,
    green: 60
  }
};

// Mock current values (in a real app, these would come from your analytics data)
const currentValues = {
  traffic: 2700,
  aqi: 120,
  co2: 850,
  temperature: 32,
  humidity: 75
};

function getAlertLevel(value: number, thresholds: { red: number; yellow: number; green: number }) {
  if (value >= thresholds.red) return 'red';
  if (value >= thresholds.yellow) return 'yellow';
  return 'green';
}

function getAlertSeverity(level: string) {
  switch (level) {
    case 'red':
      return { label: 'Critical', color: 'red', icon: AlertOctagon };
    case 'yellow':
      return { label: 'Warning', color: 'orange', icon: AlertTriangle };
    case 'green':
      return { label: 'Normal', color: 'green', icon: Bell };
    default:
      return { label: 'Unknown', color: 'gray', icon: AlertCircle };
  }
}

const alertsData = [
  { hour: "00:00", count: 2 },
  { hour: "03:00", count: 1 },
  { hour: "06:00", count: 3 },
  { hour: "09:00", count: 5 },
  { hour: "12:00", count: 4 },
  { hour: "15:00", count: 6 },
  { hour: "18:00", count: 4 },
  { hour: "21:00", count: 2 }
];

// Generate alerts based on current values and thresholds
function generateAlerts() {
  const alerts = [];
  const areas = ["Downtown", "Suburban Area", "Industrial Zone", "Residential District"];
  let id = 1;

  // Traffic alerts
  const trafficLevel = getAlertLevel(currentValues.traffic, THRESHOLDS.traffic);
  if (trafficLevel !== 'green') {
    alerts.push({
      id: id++,
      type: trafficLevel,
      title: `High Traffic Volume`,
      description: `Traffic flow exceeding ${trafficLevel === 'red' ? 'critical' : 'warning'} threshold in ${areas[0]}`,
      time: "10 minutes ago",
      category: "Traffic",
      area: areas[0]
    });
  }

  // AQI alerts
  const aqiLevel = getAlertLevel(currentValues.aqi, THRESHOLDS.aqi);
  if (aqiLevel !== 'green') {
    alerts.push({
      id: id++,
      type: aqiLevel,
      title: "Air Quality Alert",
      description: `AQI levels at ${currentValues.aqi} in ${areas[1]} - ${aqiLevel === 'red' ? 'Hazardous' : 'Unhealthy'} conditions`,
      time: "25 minutes ago",
      category: "Environmental",
      area: areas[1]
    });
  }

  // CO2 alerts
  const co2Level = getAlertLevel(currentValues.co2, THRESHOLDS.co2);
  if (co2Level !== 'green') {
    alerts.push({
      id: id++,
      type: co2Level,
      title: "High CO₂ Levels",
      description: `CO₂ concentration at ${currentValues.co2}ppm in ${areas[2]}`,
      time: "15 minutes ago",
      category: "Environmental",
      area: areas[2]
    });
  }

  // Temperature alerts
  const tempLevel = getAlertLevel(currentValues.temperature, THRESHOLDS.temperature);
  if (tempLevel !== 'green') {
    alerts.push({
      id: id++,
      type: tempLevel,
      title: "High Temperature",
      description: `Temperature at ${currentValues.temperature}°C in ${areas[3]}`,
      time: "5 minutes ago",
      category: "Environmental",
      area: areas[3]
    });
  }

  return alerts;
}

const categories = ["All", "Traffic", "Environmental", "Infrastructure", "Security", "Parking"];
const types = ["All", "Red", "Yellow", "Green"];

export function AlertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState(() => {
    const typeParam = searchParams.get('type');
    return typeParam ? typeParam.charAt(0).toUpperCase() + typeParam.slice(1) : "All";
  });
  const [alerts, setAlerts] = useState(generateAlerts());

  // Update selected type when URL changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedType(typeParam.charAt(0).toUpperCase() + typeParam.slice(1));
    }
  }, [searchParams]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(generateAlerts());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (type === "All") {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredAlerts = alerts.filter(alert => {
    const categoryMatch = selectedCategory === "All" || alert.category === selectedCategory;
    const typeMatch = selectedType === "All" || alert.type === selectedType.toLowerCase();
    return categoryMatch && typeMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alerts</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Alerts</h3>
          <div className="text-3xl font-bold">{alerts.length}</div>
          <div className="mt-2 text-sm text-gray-500">
            <span className={alerts.length > 5 ? "text-red-500" : "text-green-500"}>
              {alerts.length > 5 ? "↑" : "↓"} {Math.abs(alerts.length - 5)}
            </span> from baseline
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Critical Issues</h3>
          <div className="text-3xl font-bold text-red-500">
            {alerts.filter(a => a.type === 'red').length}
          </div>
          <div className="mt-2 text-sm text-gray-500">Requiring immediate attention</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Areas Affected</h3>
          <div className="text-3xl font-bold">
            {new Set(alerts.map(a => a.area)).size}
          </div>
          <div className="mt-2 text-sm text-gray-500">Distinct locations</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Response Time</h3>
          <div className="text-3xl font-bold">8.5 min</div>
          <div className="mt-2 text-sm text-gray-500">Average response time</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Frequency (24h)</h3>
        <div className="h-[300px]">
          <ResponsiveLine
            data={[
              {
                id: "alerts",
                data: alertsData.map(d => ({ x: d.hour, y: d.count }))
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
            pointBorderColor="#6C5DD3"
            enableArea={true}
            areaOpacity={0.1}
            colors={["#6C5DD3"]}
            enableGridX={false}
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const severity = getAlertSeverity(alert.type);
          const Icon = severity.icon;
          return (
            <Card key={alert.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-${severity.color}-100`}>
                  <Icon className={`h-5 w-5 text-${severity.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded-full bg-${severity.color}-100 text-${severity.color}-600`}>
                        {alert.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Location: {alert.area}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}