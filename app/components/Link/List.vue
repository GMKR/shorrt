<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { useQuery } from "@tanstack/vue-query"
import { useRouteQuery } from "@vueuse/router"

const page = useRouteQuery("page", 1, { transform: Number })
const limit = useRouteQuery("limit", 10, { transform: Number })
const term = useRouteQuery<string | undefined>("term", undefined)

const { data: links, isLoading, suspense } = useQuery({
  queryKey: ["links", page, limit, term],
  queryFn: () => useLinkList({ page: page.value, limit: limit.value, term: term.value }),
})

onServerPrefetch(async () => {
  suspense()
})

const columns = ref<TableColumn<LinkListItem>[]>([
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Visits",
    accessorKey: "visits",
  },
  {
    header: "Last Visit",
    accessorKey: "lastVisit",
  },

  {
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    header: "Actions",
    id: "actions",
  },
])

const handlePageChange = (newPage: number) => {
  page.value = newPage
}
</script>

<template>
  <UCard :ui="{ body: '!px-0' }">
    <UTable :columns="columns" :data="links?.results" :loading="isLoading">
      <template #slug-cell="{ row }">
        <ULink :to="{ name: 'dashboard-links-id-activity', params: { id: row.original.id } }" class="hover:underline">
          {{ row.original.slug }}
        </ULink>
      </template>
      <template #lastVisit-cell="{ row }">
        {{ useHumanDateTime(row.original.lastVisit) }}
      </template>
      <template #createdAt-cell="{ row }">
        {{ useHumanDateTime(row.original.createdAt) }}
      </template>
      <template #actions-cell="{ row }">
        <LinkListActions :link="row.original" />
      </template>
    </UTable>
    <template #footer>
      <div v-if="links?.total" class="flex justify-end">
        <UPagination
          :default-page="page"
          :items-per-page="limit"
          :total="links?.total"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </UCard>
</template>
