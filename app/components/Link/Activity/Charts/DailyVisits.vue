<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import { Line } from "vue-chartjs"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const linkId = useRouteParams<string>("id")

// Fetch daily visits data from the server
const { data: dailyVisitsData, isLoading, suspense } = useQuery({
  queryKey: ["daily-visits", linkId],
  queryFn: () => useLinkDailyVisits(+linkId.value),
})

onServerPrefetch(async () => {
  suspense()
})

// Process data for chart
const chartData = computed(() => {
  if (!dailyVisitsData.value) {
    return {
      labels: [],
      datasets: [
        {
          label: "Daily Visits",
          backgroundColor: "#10b981",
          borderColor: "#10b981",
          data: [] as number[],
          tension: 0.2,
        },
      ],
    }
  }

  // Format dates for display (e.g., "Jan 1" instead of "2023-01-01")
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  return {
    labels: dailyVisitsData.value.map(item => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Visits",
        backgroundColor: "#10b981",
        borderColor: "#10b981",
        data: dailyVisitsData.value.map(item => item.count || 0),
        tension: 0.2,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
}
</script>

<template>
  <div class="chart-container">
    <h3 class="text-lg font-medium mb-2">
      Daily Visits (Last 30 Days)
    </h3>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
      <span class="ml-2">Loading chart...</span>
    </div>
    <div v-else class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
