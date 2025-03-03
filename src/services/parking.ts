interface ParkingData {
  location: string;
  current: {
    totalSpots: number;
    occupiedSpots: number;
    availableSpots: number;
    revenue: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    occupancy: number;
    revenue: number;
  }>;
  zoneStatus: Array<{
    zone: string;
    total: number;
    occupied: number;
    type: 'public' | 'private' | 'reserved';
  }>;
  analytics: {
    peakHours: Array<{
      hour: string;
      occupancy: number;
    }>;
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    yearlyComparison: Array<{
      year: number;
      revenue: number;
    }>;
  };
}

const MOCK_DATA: Record<string, ParkingData> = {
  "Borivali": {
    location: "Borivali",
    current: {
      totalSpots: 1200,
      occupiedSpots: 850,
      availableSpots: 350,
      revenue: 42500,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 16 && hour <= 19);
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        occupancy: isPeakHour ? 850 + Math.floor(Math.random() * 100) : 500 + Math.floor(Math.random() * 300),
        revenue: isPeakHour ? 2500 + Math.floor(Math.random() * 500) : 1500 + Math.floor(Math.random() * 500)
      };
    }),
    zoneStatus: [
      { zone: "Station Area", total: 400, occupied: 380, type: "public" },
      { zone: "Market Complex", total: 500, occupied: 300, type: "private" },
      { zone: "Residential", total: 300, occupied: 170, type: "reserved" }
    ],
    analytics: {
      peakHours: [
        { hour: "09:00", occupancy: 950 },
        { hour: "17:00", occupancy: 920 },
        { hour: "18:00", occupancy: 900 }
      ],
      dailyRevenue: 42500,
      weeklyRevenue: 297500,
      monthlyRevenue: 1275000,
      yearlyComparison: [
        { year: 2020, revenue: 12000000 },
        { year: 2021, revenue: 13500000 },
        { year: 2022, revenue: 14800000 },
        { year: 2023, revenue: 15500000 },
        { year: 2024, revenue: 16000000 }
      ]
    }
  },
  "Thane": {
    location: "Thane",
    current: {
      totalSpots: 1500,
      occupiedSpots: 1200,
      availableSpots: 300,
      revenue: 60000,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 16 && hour <= 19);
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        occupancy: isPeakHour ? 1200 + Math.floor(Math.random() * 100) : 800 + Math.floor(Math.random() * 300),
        revenue: isPeakHour ? 3500 + Math.floor(Math.random() * 500) : 2000 + Math.floor(Math.random() * 500)
      };
    }),
    zoneStatus: [
      { zone: "Lake City Mall", total: 600, occupied: 550, type: "private" },
      { zone: "Station Complex", total: 500, occupied: 450, type: "public" },
      { zone: "Business District", total: 400, occupied: 200, type: "reserved" }
    ],
    analytics: {
      peakHours: [
        { hour: "10:00", occupancy: 1300 },
        { hour: "16:00", occupancy: 1250 },
        { hour: "18:00", occupancy: 1280 }
      ],
      dailyRevenue: 60000,
      weeklyRevenue: 420000,
      monthlyRevenue: 1800000,
      yearlyComparison: [
        { year: 2020, revenue: 15000000 },
        { year: 2021, revenue: 16500000 },
        { year: 2022, revenue: 18000000 },
        { year: 2023, revenue: 19500000 },
        { year: 2024, revenue: 21000000 }
      ]
    }
  },
  "Kalyan": {
    location: "Kalyan",
    current: {
      totalSpots: 1000,
      occupiedSpots: 750,
      availableSpots: 250,
      revenue: 37500,
      timestamp: new Date().toISOString()
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 16 && hour <= 19);
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        occupancy: isPeakHour ? 750 + Math.floor(Math.random() * 100) : 400 + Math.floor(Math.random() * 250),
        revenue: isPeakHour ? 2200 + Math.floor(Math.random() * 500) : 1200 + Math.floor(Math.random() * 500)
      };
    }),
    zoneStatus: [
      { zone: "Market Area", total: 400, occupied: 350, type: "public" },
      { zone: "Shopping Complex", total: 350, occupied: 250, type: "private" },
      { zone: "Residential Zone", total: 250, occupied: 150, type: "reserved" }
    ],
    analytics: {
      peakHours: [
        { hour: "09:00", occupancy: 800 },
        { hour: "17:00", occupancy: 820 },
        { hour: "18:00", occupancy: 780 }
      ],
      dailyRevenue: 37500,
      weeklyRevenue: 262500,
      monthlyRevenue: 1125000,
      yearlyComparison: [
        { year: 2020, revenue: 10000000 },
        { year: 2021, revenue: 11000000 },
        { year: 2022, revenue: 12000000 },
        { year: 2023, revenue: 13000000 },
        { year: 2024, revenue: 14000000 }
      ]
    }
  }
};

export const fetchParkingData = async (city?: string): Promise<ParkingData> => {
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