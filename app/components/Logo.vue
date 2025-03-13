<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const product = runtimeConfig.public.product
</script>

<template>
  <NuxtLink :to="{ name: 'dashboard' }">
    <h2 class="text-2xl font-bold dark:text-white text-gray-900">
      {{ product.name }}
    </h2>
  </NuxtLink>
</template>
