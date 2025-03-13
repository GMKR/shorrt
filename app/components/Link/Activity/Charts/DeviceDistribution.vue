<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import type { TooltipItem } from "chart.js"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Doughnut } from "vue-chartjs"

ChartJS.register(ArcElement, Tooltip, Legend)

const linkId = useRouteParams<string>("id")

// Fetch device distribution data from the server
const { data: deviceDistributionData, isLoading, suspense } = useQuery({
  queryKey: ["device-distribution", linkId],
  queryFn: () => useLinkDeviceDistribution(+linkId.value),
})

onServerPrefetch(async () => {
  suspense()
})

// Process data for chart
const chartData = computed(() => {
  if (!deviceDistributionData.value || deviceDistributionData.value.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: "Visits by Device",
          backgroundColor: [],
          data: [] as number[],
          borderWidth: 1,
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
    "#9ca3af", // Gray (for Others)
  ]

  return {
    labels: deviceDistributionData.value.map(item => item.device || "Unknown"),
    datasets: [
      {
        label: "Visits by Device",
        backgroundColor: colors.slice(0, deviceDistributionData.value.length),
        data: deviceDistributionData.value.map(item => item.count || 0),
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"doughnut">) => {
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
      Device Distribution
    </h3>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
      <span class="ml-2">Loading chart...</span>
    </div>
    <div v-else-if="deviceDistributionData && deviceDistributionData.length > 0" class="h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-64 text-center">
      <UIcon name="i-lucide-smartphone" class="text-4xl mb-2 text-gray-400" />
      <p class="text-gray-500">
        No device data available
      </p>
    </div>
  </div>
</template>
