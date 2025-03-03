import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  details?: {
    label: string;
    value: string | number;
  }[];
  className?: string;
  readMoreLink?: string;
  analyticsSection?: string;
}

export function MetricCard({
  icon,
  title,
  value,
  subtitle,
  details,
  className,
  readMoreLink,
  analyticsSection
}: MetricCardProps) {
  const linkTo = analyticsSection 
    ? `/analytics?section=${analyticsSection}`
    : readMoreLink || '#';

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold">{value}</span>
              {subtitle && (
                <span className="text-sm text-gray-500">{subtitle}</span>
              )}
            </div>
          </div>
        </div>
        {(readMoreLink || analyticsSection) && (
          <Link
            to={linkTo}
            className="text-xs text-[#6C5DD3] hover:underline flex items-center gap-1"
          >
            Read more
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {details && (
        <div className="mt-4 space-y-2">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">{detail.label}</span>
              <span className="font-medium">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}