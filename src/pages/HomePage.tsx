import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metrics/MetricCard"
import { Link } from "react-router-dom"

export function HomePage() {
  const metrics = [
    {
      title: "Air Quality Index",
      value: "65",
      status: { label: "Moderate", type: "moderate" as const }
    },
    {
      title: "Traffic Congestion",
      value: "35%",
      status: { label: "Low", type: "success" as const }
    },
    {
      title: "Active Alerts",
      value: "2",
      status: { label: "Warning", type: "warning" as const }
    }
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            status={metric.status}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/dashboard">View Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link to="/analytics">Access Reports</Link>
        </Button>
      </div>
    </div>
  )
}