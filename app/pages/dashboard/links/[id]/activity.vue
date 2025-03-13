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
    <LinkActivityList />
  </Page>
</template>
