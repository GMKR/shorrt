<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"
import { useQueryClient } from "@tanstack/vue-query"

const props = defineProps<{
  link: LinkListItem
}>()

const isEditOpen = ref(false)

const queryClient = useQueryClient()

const handleSuccess = () => {
  isEditOpen.value = false
  queryClient.invalidateQueries({ queryKey: ["links"] })
}

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: "Activity",
        icon: "i-lucide-activity",
        onSelect: () => {
          navigateTo({
            name: "dashboard-links-id-activity",
            params: { id: props.link.id },
          })
        },
      },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-pencil",
        onSelect: () => {
          isEditOpen.value = true
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
      },
    ],
  ]
})
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-ellipsis-vertical" size="sm" variant="outline" />
  </UDropdownMenu>
  <UModal v-model:open="isEditOpen" title="Edit Link" description="Edit the link">
    <template #body>
      <LinkForm :link="link" @success="handleSuccess" />
    </template>
  </UModal>
</template>
