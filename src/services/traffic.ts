interface Location {
  latitude: number;
  longitude: number;
}

interface TrafficData {
  duration: number;  // Duration in seconds
  vehicleCount: number;
  timestamp: string;
}

export interface LocationTrafficData {
  location: string;
  currentTraffic: TrafficData;
  peakHour: {
    hour: number;
    vehicleCount: number;
  };
  dailyTotal: number;
  hourlyData: Array<{
    hour: string;
    vehicleCount: number;
  }>;
}

const LOCATIONS: Record<string, Location> = {
  "Thane": { latitude: 19.2183, longitude: 72.9783 },
  "Borivali": { latitude: 19.2301, longitude: 72.8507 },
  "Kalyan": { latitude: 19.2432, longitude: 73.1356 }
};

// Generate realistic hourly data based on typical traffic patterns
const generateHourlyData = (baseCount: number, location: string) => {
  return Array.from({ length: 24 }, (_, hour) => {
    let multiplier = 1;
    
    // Morning rush hour (8-10 AM)
    if (hour >= 8 && hour <= 10) {
      multiplier = location === "Thane" ? 2.8 : 2.5;
    }
    // Evening rush hour (5-7 PM)
    else if (hour >= 17 && hour <= 19) {
      multiplier = location === "Borivali" ? 3.0 : 2.8;
    }
    // Late night (11 PM - 5 AM)
    else if (hour >= 23 || hour <= 5) {
      multiplier = 0.3;
    }
    // Normal daytime
    else {
      multiplier = 1.5;
    }

    // Add location-specific variations
    const locationMultiplier = {
      "Thane": 1.2,    // Higher traffic due to business district
      "Borivali": 1.1, // Moderate traffic
      "Kalyan": 0.9    // Lower traffic in suburban area
    }[location] || 1;

    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      vehicleCount: Math.round(baseCount * multiplier * locationMultiplier + (Math.random() * 100 - 50))
    };
  });
};

// Generate mock traffic data with realistic patterns
const generateMockTrafficData = (location: string): LocationTrafficData => {
  const currentHour = new Date().getHours();
  const baseCount = 300; // Base vehicle count per hour
  const hourlyData = generateHourlyData(baseCount, location);
  
  // Find peak hour
  const peakHourData = hourlyData.reduce((max, current) => 
    current.vehicleCount > max.vehicleCount ? current : max
  );

  // Calculate daily total
  const dailyTotal = hourlyData.reduce((sum, hour) => sum + hour.vehicleCount, 0);

  return {
    location,
    currentTraffic: {
      duration: Math.round(hourlyData[currentHour].vehicleCount * 1.2), // Rough duration estimate
      vehicleCount: hourlyData[currentHour].vehicleCount,
      timestamp: new Date().toISOString()
    },
    peakHour: {
      hour: parseInt(peakHourData.hour),
      vehicleCount: peakHourData.vehicleCount
    },
    dailyTotal,
    hourlyData
  };
};

export const fetchTrafficData = async (city?: string): Promise<LocationTrafficData | LocationTrafficData[]> => {
  try {
    if (city) {
      // Return data for specific city
      return generateMockTrafficData(city);
    }
    // Generate mock data for each location
    const mockData = Object.keys(LOCATIONS).map(location =>
      generateMockTrafficData(location)
    );

    return mockData;
  } catch (error) {
    console.error('Error generating traffic data:', error);
    throw new Error('Failed to generate traffic data');
  }
};