<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { useMutation } from "@tanstack/vue-query"

const props = defineProps<{
  link?: LinkListItem | Link
}>()

const slugPrefix = computed(() => {
  return useRuntimeConfig().public.product.url + "/r/"
})

const validationSchema = computed(() => {
  if (props.link) {
    return LinkUpdateBodySchema
  }
  return LinkCreateBodySchema
})

const state = reactive<Partial<LinkCreateBody | LinkUpdateBody>>({
  title: props.link?.title ?? undefined,
  slug: props.link?.slug ?? undefined,
  url: props.link?.url ?? undefined,
  description: props.link?.description ?? undefined,
  config: props.link?.config ?? undefined,
})

const emits = defineEmits<{
  success: []
}>()

const { mutate: create, isPending: isCreating } = useMutation({
  mutationFn: (data: LinkCreateBody) => useLinkCreate(data),
  onSuccess: () => {
    emits("success")
  },
})

const { mutate: update, isPending: isUpdating } = useMutation({
  mutationFn: (data: LinkUpdateBody) => useLinkUpdate(props.link!.id, data),
  onSuccess: () => {
    emits("success")
  },
})

const onSubmit = (event: FormSubmitEvent<LinkCreateBody | LinkUpdateBody>) => {
  if (props.link) {
    update(event.data as LinkUpdateBody)
  }
  else {
    create(event.data as LinkCreateBody)
  }
}

const isLoading = computed(() => {
  return isCreating.value || isUpdating.value
})
</script>

<template>
  <UForm :state="state" :schema="validationSchema" @submit="onSubmit">
    <UFormField label="Slug" name="slug">
      <UButtonGroup class="w-full items-center">
        <UInput :value="slugPrefix" disabled />
        <UInput
          v-model="state.slug"
        />
      </UButtonGroup>
    </UFormField>
    <UFormField label="URL" name="url">
      <UInput v-model="state.url" />
    </UFormField>
    <UFormField label="Title" name="title">
      <UInput v-model="state.title" />
    </UFormField>
    <UFormField label="Description" name="description">
      <UInput v-model="state.description" />
    </UFormField>
    <UButton :label="props.link ? 'Update' : 'Create'" :loading="isLoading" type="submit" />
  </UForm>
</template>
