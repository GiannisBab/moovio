import { KpiCards } from "@/components/dashboard/kpi-cards"
import { TrafficFlowChart } from "@/components/dashboard/traffic-flow-chart"
import { ModalSplitChart } from "@/components/dashboard/modal-split-chart"
import { CongestionAlerts } from "@/components/dashboard/congestion-alerts"
import { RidershipChart } from "@/components/dashboard/ridership-chart"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { kpiData, congestionAlerts } from "@/lib/data/dashboard-data"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <WelcomeSection alerts={congestionAlerts} />
        <TimeRangeSelector />
      </div>
      <KpiCards data={kpiData} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TrafficFlowChart className="lg:col-span-2" />
        <ModalSplitChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CongestionAlerts data={congestionAlerts} />
        <RidershipChart className="lg:col-span-2" />
      </div>
    </div>
  )
}
