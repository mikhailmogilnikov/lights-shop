import { DASHBOARD_STATS } from '../model/stats-titles'
import type { ApiComponents } from '@/shared/api'
import { Card, CardHeader, CardTitle } from '@/shared/ui/card'

interface DashboardStatsProps {
  data: ApiComponents['Dashboard']
}

export function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {DASHBOARD_STATS.map((stat) => (
        <Card key={stat.id}>
          <CardHeader>
            <CardTitle>{stat.title}</CardTitle>
            <p className="text-2xl font-bold mt-2">
              {stat.id === 'totalRevenue'
                ? `${data[stat.id].toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}`
                : data[stat.id]}
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
