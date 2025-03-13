<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const product = runtimeConfig.public.product

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - ${product.name}` : product.name
  },
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <UApp :toaster="{ position: 'top-right' }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
