<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query"

defineOptions({
  inheritAttrs: false,
})

const isOpen = ref(false)

const emits = defineEmits<{
  success: []
}>()

const queryClient = useQueryClient()

const handleSuccess = () => {
  isOpen.value = false
  emits("success")
  queryClient.invalidateQueries({ queryKey: ["links"] })
}
</script>

<template>
  <UButton
    label="New Link"
    icon="i-lucide-plus"
    v-bind="$attrs"
    @click="isOpen = true"
  />
  <UModal v-model:open="isOpen" title="New Link" description="Create a new link">
    <template #body>
      <LinkForm @success="handleSuccess" />
    </template>
  </UModal>
</template>
