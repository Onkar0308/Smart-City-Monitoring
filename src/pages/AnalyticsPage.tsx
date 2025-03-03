import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { StreetLightAnalytics } from "@/components/analytics/StreetLightAnalytics";
import { TrafficAnalytics } from "@/components/analytics/TrafficAnalytics";
import { ParkingAnalytics } from "@/components/analytics/ParkingAnalytics";
import { EnvironmentalAnalytics } from "@/components/analytics/EnvironmentalAnalytics";
import { SecurityAnalytics } from "@/components/analytics/SecurityAnalytics";

type AnalyticsSection = 'traffic' | 'lights' | 'parking' | 'environmental' | 'security';

const sections = [
  { id: 'traffic', label: 'Traffic Flow' },
  { id: 'lights', label: 'Street Lights' },
  { id: 'parking', label: 'Parking' },
  { id: 'environmental', label: 'Environmental' },
  { id: 'security', label: 'Security' }
] as const;

export function AnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<AnalyticsSection>('traffic');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && sections.some(s => s.id === section)) {
      setActiveSection(section as AnalyticsSection);
    }
  }, [searchParams]);

  const handleSectionChange = (section: AnalyticsSection) => {
    setActiveSection(section);
    setSearchParams({ section });
  };

  const renderAnalytics = () => {
    switch (activeSection) {
      case 'traffic':
        return <TrafficAnalytics />;
      case 'lights':
        return <StreetLightAnalytics />;
      case 'parking':
        return <ParkingAnalytics />;
      case 'environmental':
        return <EnvironmentalAnalytics />;
      case 'security':
        return <SecurityAnalytics />;
      default:
        return <TrafficAnalytics />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Download Report
        </button>
      </div>

      <Card className="p-1">
        <div className="flex items-center bg-[#F4F7FE] rounded-lg p-1">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-[#6C5DD3] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSectionChange(section.id as AnalyticsSection)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Analytics Content */}
      <div className="mt-6">
        {renderAnalytics()}
      </div>
    </div>
  );
}