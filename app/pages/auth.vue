<script setup lang="ts">
definePageMeta({
  layout: false,
  ignoreAuth: true,
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col w-full max-w-lg gap-y-6">
      <div class="flex items-center justify-center ">
        <Logo size="xl" />
      </div>
      <NuxtPage />
    </div>
  </div>
</template>
