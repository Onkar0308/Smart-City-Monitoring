interface StreetLightData {
  location: string;
  current: {
    totalLights: number;
    activeLights: number;
    faultyLights: number;
    energyConsumption: number; // in kWh
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    activeCount: number;
    energyUsage: number;
  }>;
  faultReport: Array<{
    zone: string;
    count: number;
    status: 'critical' | 'moderate' | 'minor';
  }>;
  energyStats: {
    daily: number;
    weekly: number;
    monthly: number;
    yearlyComparison: Array<{
      year: number;
      consumption: number;
    }>;
  };
}

const MOCK_DATA: Record<string, StreetLightData> = {
  "Borivali": {
    location: "Borivali",
    current: {
      totalLights: 2500,
      activeLights: 2450,
      faultyLights: 50,
      energyConsumption: 875,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isDayTime = hour >= 6 && hour <= 18;
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        activeCount: isDayTime ? 0 : 2450,
        energyUsage: isDayTime ? 0 : 35 + Math.random() * 5
      };
    }),
    faultReport: [
      { zone: "Western Zone", count: 20, status: "moderate" },
      { zone: "Central Area", count: 15, status: "minor" },
      { zone: "Railway Station", count: 15, status: "critical" }
    ],
    energyStats: {
      daily: 875,
      weekly: 6125,
      monthly: 26250,
      yearlyComparison: [
        { year: 2020, consumption: 350000 },
        { year: 2021, consumption: 340000 },
        { year: 2022, consumption: 320000 },
        { year: 2023, consumption: 310000 },
        { year: 2024, consumption: 300000 }
      ]
    }
  },
  "Thane": {
    location: "Thane",
    current: {
      totalLights: 3000,
      activeLights: 2900,
      faultyLights: 100,
      energyConsumption: 1050,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isDayTime = hour >= 6 && hour <= 18;
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        activeCount: isDayTime ? 0 : 2900,
        energyUsage: isDayTime ? 0 : 42 + Math.random() * 6
      };
    }),
    faultReport: [
      { zone: "Lake Area", count: 35, status: "critical" },
      { zone: "Market Zone", count: 40, status: "moderate" },
      { zone: "Residential Area", count: 25, status: "minor" }
    ],
    energyStats: {
      daily: 1050,
      weekly: 7350,
      monthly: 31500,
      yearlyComparison: [
        { year: 2020, consumption: 420000 },
        { year: 2021, consumption: 410000 },
        { year: 2022, consumption: 395000 },
        { year: 2023, consumption: 380000 },
        { year: 2024, consumption: 370000 }
      ]
    }
  },
  "Kalyan": {
    location: "Kalyan",
    current: {
      totalLights: 2800,
      activeLights: 2700,
      faultyLights: 100,
      energyConsumption: 980,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isDayTime = hour >= 6 && hour <= 18;
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        activeCount: isDayTime ? 0 : 2700,
        energyUsage: isDayTime ? 0 : 39 + Math.random() * 5
      };
    }),
    faultReport: [
      { zone: "Main Market", count: 30, status: "critical" },
      { zone: "Station Road", count: 45, status: "moderate" },
      { zone: "New Development", count: 25, status: "minor" }
    ],
    energyStats: {
      daily: 980,
      weekly: 6860,
      monthly: 29400,
      yearlyComparison: [
        { year: 2020, consumption: 390000 },
        { year: 2021, consumption: 385000 },
        { year: 2022, consumption: 375000 },
        { year: 2023, consumption: 360000 },
        { year: 2024, consumption: 350000 }
      ]
    }
  }
};

export const fetchStreetLightData = async (city?: string): Promise<StreetLightData> => {
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