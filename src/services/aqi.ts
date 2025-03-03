import axios from 'axios';
import { initializeAQIPredictor, predictAQI, type AQIPrediction } from './ml/aqi_predictor';

const API_KEY = 'ff7666bc1d1a8b78288bfb10ef6d29995b3f51d6';
const BASE_URL = 'https://api.waqi.info/feed';

const LOCATIONS = ["thane", "kalyan", "andheri", "borivali", "virar", "dadar", "khargar"] as const;
type Location = typeof LOCATIONS[number];

// Normalize location name to match our constants
const normalizeLocation = (location: string): Location => {
  const normalized = location.toLowerCase();
  if (LOCATIONS.includes(normalized as Location)) {
    return normalized as Location;
  }
  return 'kalyan'; // Default to kalyan if location not found
};

// Mock data for each location when API fails
const LOCATION_MOCK_DATA: Record<Location, WAQIResponse['data']> = {
  thane: {
    aqi: 145,
    iaqi: {
      pm25: { v: 145 },
      t: { v: 28 },
      h: { v: 65 },
      co: { v: 1.8 }
    },
    time: { s: new Date().toISOString() }
  },
  kalyan: {
    aqi: 155,
    iaqi: {
      pm25: { v: 155 },
      t: { v: 29 },
      h: { v: 62 },
      co: { v: 2.1 }
    },
    time: { s: new Date().toISOString() }
  },
  andheri: {
    aqi: 135,
    iaqi: {
      pm25: { v: 135 },
      t: { v: 27 },
      h: { v: 70 },
      co: { v: 1.6 }
    },
    time: { s: new Date().toISOString() }
  },
  borivali: {
    aqi: 125,
    iaqi: {
      pm25: { v: 125 },
      t: { v: 26 },
      h: { v: 72 },
      co: { v: 1.4 }
    },
    time: { s: new Date().toISOString() }
  },
  virar: {
    aqi: 115,
    iaqi: {
      pm25: { v: 115 },
      t: { v: 25 },
      h: { v: 75 },
      co: { v: 1.2 }
    },
    time: { s: new Date().toISOString() }
  },
  dadar: {
    aqi: 165,
    iaqi: {
      pm25: { v: 165 },
      t: { v: 30 },
      h: { v: 60 },
      co: { v: 2.3 }
    },
    time: { s: new Date().toISOString() }
  },
  khargar: {
    aqi: 130,
    iaqi: {
      pm25: { v: 130 },
      t: { v: 27 },
      h: { v: 68 },
      co: { v: 1.5 }
    },
    time: { s: new Date().toISOString() }
  }
};

interface WAQIResponse {
  status: string;
  data: {
    aqi: number;
    iaqi: {
      pm25?: { v: number };
      t?: { v: number };    // temperature
      h?: { v: number };    // humidity
      co?: { v: number };   // CO2
    };
    time: {
      s: string;  // timestamp
    };
  };
}

export interface EnvironmentalData {
  current: {
    aqi: {
      value: number;
      category: string;
      prediction?: AQIPrediction;
    };
    temperature: number;
    humidity: number;
    co2: number;
    timestamp: string;
  };
  hourly: Array<{
    hour: string;
    aqi: {
      value: number;
      category: string;
    };
    temperature: number;
    humidity: number;
    co2: number;
  }>;
  locationAverages: Array<{
    location: string;
    averageAqi: number;
  }>;
  timeRangeAverages: {
    daily: Array<{
      hour: string;
      averageAqi: number;
    }>;
    weekly: Array<{
      week: string;
      averageAqi: number;
    }>;
    monthly: Array<{
      month: string;
      averageAqi: number;
    }>;
    yearly: Array<{
      year: string;
      averageAqi: number;
    }>;
  };
}

export const getAqiCategory = (value: number): string => {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const fetchLocationAQI = async (location: string): Promise<WAQIResponse['data']> => {
  const normalizedLocation = normalizeLocation(location);
  
  try {
    const response = await axios.get<WAQIResponse>(`${BASE_URL}/${normalizedLocation}/?token=${API_KEY}`);
    
    if (response.data.status !== 'ok') {
      throw new Error(`Failed to fetch data for ${location}`);
    }

    return response.data.data;
  } catch (error) {
    console.error(`Using mock data for ${location}:`, error);
    return {
      ...LOCATION_MOCK_DATA[normalizedLocation],
      time: { s: new Date().toISOString() }
    };
  }
};

// Generate historical AQI data for model training
const generateHistoricalAQIData = (baseAQI: number): number[] => {
  const data: number[] = [];
  const hoursInYear = 24 * 365;
  
  for (let hour = 0; hour < hoursInYear; hour++) {
    const dayOfYear = Math.floor(hour / 24);
    const hourOfDay = hour % 24;
    
    // Seasonal variation (worse in winter)
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI/2) * 0.3 + 1;
    
    // Daily variation (worse during rush hours)
    let hourlyFactor = 1;
    if (hourOfDay >= 7 && hourOfDay <= 10) { // Morning rush
      hourlyFactor = 1.3;
    } else if (hourOfDay >= 17 && hourOfDay <= 20) { // Evening rush
      hourlyFactor = 1.4;
    } else if (hourOfDay >= 1 && hourOfDay <= 4) { // Early morning
      hourlyFactor = 0.7;
    }
    
    // Random variation (±20%)
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const aqi = Math.round(baseAQI * seasonalFactor * hourlyFactor * randomFactor);
    data.push(Math.min(500, Math.max(0, aqi))); // Clamp between 0 and 500
  }
  
  return data;
};

// Initialize predictors for each location
const initializePredictors = async () => {
  for (const location of LOCATIONS) {
    const baseAQI = LOCATION_MOCK_DATA[location].aqi;
    const historicalData = generateHistoricalAQIData(baseAQI);
    await initializeAQIPredictor(historicalData);
  }
};

// Initialize on module load
initializePredictors().catch(console.error);

// Generate realistic historical data patterns
const generateHistoricalData = () => {
  const currentDate = new Date();
  const dailyData = [];
  const weeksData = [];
  const monthsData = [];
  const yearsData = [];

  // Daily data: Shows typical 24-hour pattern
  const hourlyPattern = [
    70,  // 12 AM - Low traffic
    60,  // 1 AM
    55,  // 2 AM
    50,  // 3 AM - Lowest point
    65,  // 4 AM
    90,  // 5 AM
    120, // 6 AM - Morning rush
    150, // 7 AM - Peak
    140, // 8 AM
    120, // 9 AM
    110, // 10 AM
    100, // 11 AM
    95,  // 12 PM
    100, // 1 PM
    105, // 2 PM
    110, // 3 PM
    120, // 4 PM
    135, // 5 PM - Evening rush
    140, // 6 PM - Peak
    130, // 7 PM
    120, // 8 PM
    110, // 9 PM
    90,  // 10 PM
    80   // 11 PM
  ];

  for (let hour = 0; hour < 24; hour++) {
    const baseValue = hourlyPattern[hour];
    const hourlyVariation = Math.random() * 10 - 5;
    
    dailyData.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      averageAqi: Math.round(baseValue + hourlyVariation)
    });
  }

  // Weekly data: Shows work week pattern
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const weekdayPattern = [120, 140, 150, 145, 130, 90, 85]; // Mon-Sun pattern
  
  for (let week = 0; week < 4; week++) {
    const baseValue = weekdayPattern[week % 7];
    const weeklyVariation = Math.random() * 20 - 10;
    
    weeksData.push({
      week: weekLabels[week],
      averageAqi: Math.round(baseValue + weeklyVariation)
    });
  }

  // Monthly data: Shows seasonal pattern
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalPattern = {
    winter: 180, // High AQI in winter
    spring: 120,
    summer: 90,  // Better AQI in summer
    monsoon: 70, // Best AQI during monsoon
    autumn: 150
  };

  for (let i = 0; i < 12; i++) {
    let baseValue;
    if (i <= 1) baseValue = seasonalPattern.winter;      // Jan-Feb
    else if (i <= 4) baseValue = seasonalPattern.spring; // Mar-May
    else if (i <= 6) baseValue = seasonalPattern.summer; // Jun-Jul
    else if (i <= 8) baseValue = seasonalPattern.monsoon;// Aug-Oct
    else baseValue = seasonalPattern.autumn;             // Nov-Dec

    const variation = Math.random() * 30 - 15;
    
    monthsData.push({
      month: monthNames[i],
      averageAqi: Math.round(baseValue + variation)
    });
  }

  // Yearly data: Shows improvement trend
  const startingAqi = 200; // Higher AQI 5 years ago
  const yearlyImprovement = 25; // Significant improvement each year
  
  for (let i = 0; i < 5; i++) {
    const yearDate = new Date(currentDate);
    yearDate.setFullYear(yearDate.getFullYear() - (4 - i));
    
    const baseValue = startingAqi - (yearlyImprovement * i);
    const yearlyVariation = Math.random() * 15 - 7.5;
    
    yearsData.push({
      year: yearDate.getFullYear().toString(),
      averageAqi: Math.round(baseValue + yearlyVariation)
    });
  }

  return {
    daily: dailyData,
    weekly: weeksData,
    monthly: monthsData,
    yearly: yearsData
  };
};

export const fetchEnvironmentalData = async (city?: string): Promise<EnvironmentalData> => {
  try {
    const normalizedCity = city ? normalizeLocation(city) : 'kalyan';
    const cityData = await fetchLocationAQI(normalizedCity);

    // Generate historical data with realistic patterns
    const timeRangeAverages = generateHistoricalData();

    // Get AQI prediction
    const recentData = timeRangeAverages.daily.map(d => d.averageAqi);
    const prediction = await predictAQI(recentData);

    // Fetch data for all locations for averages
    const locationData = await Promise.all(
      LOCATIONS.map(async (location) => {
        if (location === normalizedCity) {
          return { location, data: cityData };
        }
        const data = await fetchLocationAQI(location);
        return { location, data };
      })
    );

    // Calculate location averages
    const locationAverages = locationData.map(({ location, data }) => ({
      location,
      averageAqi: data.aqi
    }));
    const currentTime = new Date();
    const hourlyData = [];

    // Generate hourly data from 1 AM to 9 AM
    for (let hour = 1; hour <= 9; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0, 0);
      
      const aqiValue = cityData.iaqi.pm25?.v || cityData.aqi;
      hourlyData.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        aqi: {
          value: aqiValue,
          category: getAqiCategory(aqiValue)
        },
        temperature: cityData.iaqi.t?.v || 20,
        humidity: cityData.iaqi.h?.v || 45,
        co2: cityData.iaqi.co?.v || 65
      });
    }

    return {
      current: {
        aqi: {
          value: cityData.aqi,
          category: getAqiCategory(cityData.aqi),
          prediction
        },
        temperature: cityData.iaqi.t?.v || 20,
        humidity: cityData.iaqi.h?.v || 45,
        co2: cityData.iaqi.co?.v || 65,
        timestamp: cityData.time.s || currentTime.toISOString()
      },
      hourly: hourlyData,
      locationAverages,
      timeRangeAverages
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`WAQI API error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching AQI data');
  }
};