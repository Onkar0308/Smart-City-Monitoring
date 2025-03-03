interface SecurityData {
  location: string;
  current: {
    activeCameras: number;
    totalCameras: number;
    activePatrols: number;
    pendingAlerts: number;
    timestamp: string;
  };
  incidents: Array<{
    type: 'theft' | 'traffic' | 'vandalism' | 'emergency' | 'suspicious';
    count: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    responseTime: number; // in minutes
  }>;
  zoneStatus: Array<{
    zone: string;
    riskLevel: 'high' | 'medium' | 'low';
    cameras: {
      total: number;
      active: number;
    };
    incidents: number;
  }>;
  analytics: {
    responseTime: {
      average: number;
      peak: number;
      offPeak: number;
    };
    hourly: Array<{
      hour: string;
      incidents: number;
      responseTime: number;
    }>;
    monthlyTrends: Array<{
      month: string;
      incidents: number;
      resolved: number;
    }>;
  };
}

const MOCK_DATA: Record<string, SecurityData> = {
  "Borivali": {
    location: "Borivali",
    current: {
      activeCameras: 180,
      totalCameras: 200,
      activePatrols: 12,
      pendingAlerts: 5,
      timestamp: new Date().toISOString()
    },
    incidents: [
      { type: 'theft', count: 15, trend: 'decreasing', responseTime: 8 },
      { type: 'traffic', count: 25, trend: 'stable', responseTime: 5 },
      { type: 'vandalism', count: 8, trend: 'decreasing', responseTime: 12 },
      { type: 'emergency', count: 5, trend: 'stable', responseTime: 4 },
      { type: 'suspicious', count: 20, trend: 'increasing', responseTime: 7 }
    ],
    zoneStatus: [
      {
        zone: "Station Area",
        riskLevel: "high",
        cameras: { total: 60, active: 55 },
        incidents: 25
      },
      {
        zone: "Market Complex",
        riskLevel: "medium",
        cameras: { total: 80, active: 75 },
        incidents: 18
      },
      {
        zone: "Residential Area",
        riskLevel: "low",
        cameras: { total: 60, active: 50 },
        incidents: 10
      }
    ],
    analytics: {
      responseTime: {
        average: 7.2,
        peak: 12,
        offPeak: 5
      },
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        incidents: Math.floor(Math.random() * 5) + (i >= 20 || i <= 4 ? 5 : 2),
        responseTime: 5 + Math.random() * 5
      })),
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        incidents: 60 + Math.floor(Math.random() * 30),
        resolved: 55 + Math.floor(Math.random() * 25)
      }))
    }
  },
  "Thane": {
    location: "Thane",
    current: {
      activeCameras: 250,
      totalCameras: 280,
      activePatrols: 15,
      pendingAlerts: 8,
      timestamp: new Date().toISOString()
    },
    incidents: [
      { type: 'theft', count: 22, trend: 'stable', responseTime: 7 },
      { type: 'traffic', count: 35, trend: 'increasing', responseTime: 4 },
      { type: 'vandalism', count: 12, trend: 'stable', responseTime: 10 },
      { type: 'emergency', count: 8, trend: 'decreasing', responseTime: 3 },
      { type: 'suspicious', count: 25, trend: 'increasing', responseTime: 6 }
    ],
    zoneStatus: [
      {
        zone: "Lake City Mall",
        riskLevel: "high",
        cameras: { total: 90, active: 85 },
        incidents: 30
      },
      {
        zone: "Station Complex",
        riskLevel: "high",
        cameras: { total: 100, active: 90 },
        incidents: 28
      },
      {
        zone: "Business District",
        riskLevel: "medium",
        cameras: { total: 90, active: 75 },
        incidents: 15
      }
    ],
    analytics: {
      responseTime: {
        average: 6.5,
        peak: 10,
        offPeak: 4
      },
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        incidents: Math.floor(Math.random() * 6) + (i >= 20 || i <= 4 ? 6 : 3),
        responseTime: 4 + Math.random() * 5
      })),
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        incidents: 80 + Math.floor(Math.random() * 40),
        resolved: 75 + Math.floor(Math.random() * 35)
      }))
    }
  },
  "Kalyan": {
    location: "Kalyan",
    current: {
      activeCameras: 150,
      totalCameras: 180,
      activePatrols: 10,
      pendingAlerts: 6,
      timestamp: new Date().toISOString()
    },
    incidents: [
      { type: 'theft', count: 18, trend: 'increasing', responseTime: 9 },
      { type: 'traffic', count: 28, trend: 'stable', responseTime: 6 },
      { type: 'vandalism', count: 10, trend: 'stable', responseTime: 13 },
      { type: 'emergency', count: 6, trend: 'decreasing', responseTime: 5 },
      { type: 'suspicious', count: 22, trend: 'stable', responseTime: 8 }
    ],
    zoneStatus: [
      {
        zone: "Market Area",
        riskLevel: "high",
        cameras: { total: 60, active: 50 },
        incidents: 22
      },
      {
        zone: "Shopping Complex",
        riskLevel: "medium",
        cameras: { total: 70, active: 60 },
        incidents: 20
      },
      {
        zone: "Residential Zone",
        riskLevel: "low",
        cameras: { total: 50, active: 40 },
        incidents: 12
      }
    ],
    analytics: {
      responseTime: {
        average: 8.0,
        peak: 13,
        offPeak: 6
      },
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        incidents: Math.floor(Math.random() * 4) + (i >= 20 || i <= 4 ? 4 : 2),
        responseTime: 6 + Math.random() * 5
      })),
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        incidents: 70 + Math.floor(Math.random() * 35),
        resolved: 65 + Math.floor(Math.random() * 30)
      }))
    }
  }
};

export const fetchSecurityData = async (city?: string): Promise<SecurityData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!city || !MOCK_DATA[city]) {
    return MOCK_DATA["Borivali"]; // Default to Borivali if city not specified or not found
  }

  return {
    ...MOCK_DATA[city],
    current: {
      ...MOCK_DATA[city].current,
      timestamp: new Date().toISOString()
    }
  };
};