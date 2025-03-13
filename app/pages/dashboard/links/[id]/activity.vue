<script setup lang="ts">
useHead({
  title: "Link Activity",
})
</script>

<template>
  <Page title="Link Activity">
    <template #actions>
      <UButton label="All Links" :to="{ name: 'dashboard' }" icon="i-lucide-arrow-left" />
    </template>

    <LinkActivityChartsDashboard />

    <div class="mt-6">
      <h3 class="text-lg font-medium mb-4">
        Activity Log
      </h3>
      <LinkActivityList />
    </div>
  </Page>
</template>
