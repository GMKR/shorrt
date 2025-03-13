<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import type { TooltipItem } from "chart.js"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { Bar } from "vue-chartjs"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const linkId = useRouteParams<string>("id")

// Fetch referrer distribution data from the server
const { data: referrerDistributionData, isLoading, suspense } = useQuery({
  queryKey: ["referrer-distribution", linkId],
  queryFn: () => useLinkReferrerDistribution(+linkId.value),
})

onServerPrefetch(async () => {
  suspense()
})

// Process data for chart
const chartData = computed(() => {
  if (!referrerDistributionData.value || referrerDistributionData.value.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: "Visits by Referrer",
          backgroundColor: [],
          data: [] as number[],
          borderWidth: 1,
        },
      ],
    }
  }

  // Generate colors
  const colors = Array(referrerDistributionData.value.length).fill("#10b981")

  return {
    labels: referrerDistributionData.value.map(item => item.referrer || "Direct"),
    datasets: [
      {
        label: "Visits by Referrer",
        backgroundColor: colors,
        data: referrerDistributionData.value.map(item => item.count || 0),
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"bar">) => {
          const value = context.raw as number || 0
          const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${value} visits (${percentage}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="chart-container">
    <h3 class="text-lg font-medium mb-2">
      Top Referrers
    </h3>
    <div v-if="isLoading" class="flex justify-center items-center h-80">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
      <span class="ml-2">Loading chart...</span>
    </div>
    <div v-else-if="referrerDistributionData && referrerDistributionData.length > 0" class="h-80">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-80 text-center">
      <UIcon name="i-lucide-external-link" class="text-4xl mb-2 text-gray-400" />
      <p class="text-gray-500">
        No referrer data available
      </p>
    </div>
  </div>
</template>
