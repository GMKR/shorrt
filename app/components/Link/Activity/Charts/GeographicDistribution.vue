<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import type { TooltipItem } from "chart.js"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Pie } from "vue-chartjs"

ChartJS.register(ArcElement, Tooltip, Legend)

const linkId = useRouteParams<string>("id")

// Fetch geographic distribution data from the server
const { data: geoDistributionData, isLoading, suspense } = useQuery({
  queryKey: ["geo-distribution", linkId],
  queryFn: () => useLinkGeoDistribution(+linkId.value),
})

onServerPrefetch(async () => {
  suspense()
})

// Process data for chart
const chartData = computed(() => {
  if (!geoDistributionData.value || geoDistributionData.value.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: "Visits by Country",
          backgroundColor: [],
          data: [] as number[],
        },
      ],
    }
  }

  // Generate colors
  const colors = [
    "#10b981", // Green
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
    "#f97316", // Orange
    "#6366f1", // Indigo
    "#9ca3af", // Gray (for Others)
  ]

  return {
    labels: geoDistributionData.value.map(item => item.country || "Unknown"),
    datasets: [
      {
        label: "Visits by Country",
        backgroundColor: colors.slice(0, geoDistributionData.value.length),
        data: geoDistributionData.value.map(item => item.count || 0),
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"pie">) => {
          const label = context.label || ""
          const value = context.raw as number || 0
          const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value} (${percentage}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="chart-container">
    <h3 class="text-lg font-medium mb-2">
      Geographic Distribution
    </h3>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
      <span class="ml-2">Loading chart...</span>
    </div>
    <div v-else-if="geoDistributionData && geoDistributionData.length > 0" class="h-64">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-64 text-center">
      <UIcon name="i-lucide-globe" class="text-4xl mb-2 text-gray-400" />
      <p class="text-gray-500">
        No geographic data available
      </p>
    </div>
  </div>
</template>
