<script setup lang="ts">
useHead({
  title: "Dashboard",
})
</script>

<template>
  <Page title="Dashboard">
    <template #actions>
      <LinkCreateButton />
    </template>
    <LinkList />
  </Page>
</template>
