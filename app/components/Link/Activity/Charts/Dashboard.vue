<script setup lang="ts">
// No need to fetch activities here anymore as each chart component fetches its own data
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <UCard>
        <LinkActivityChartsDailyVisits />
      </UCard>

      <UCard>
        <LinkActivityChartsGeographicDistribution />
      </UCard>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <UCard>
        <LinkActivityChartsDeviceDistribution />
      </UCard>

      <UCard>
        <LinkActivityChartsBrowserDistribution />
      </UCard>
    </div>

    <UCard class="mb-4">
      <LinkActivityChartsReferrerDistribution />
    </UCard>
  </div>
</template>
