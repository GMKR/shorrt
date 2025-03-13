<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold">
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="text-gray-500"
        >
          {{ description }}
        </p>
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
