<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { useQuery } from "@tanstack/vue-query"

const page = useRouteQuery("page", 1, { transform: Number })
const limit = useRouteQuery("limit", 10, { transform: Number })
const fromDate = useRouteQuery("fromDate", undefined)
const toDate = useRouteQuery("toDate", undefined)

const linkId = useRouteParams<string>("id")

const { data: activities, isLoading, suspense } = useQuery({
  queryKey: ["activities", page, limit, fromDate, toDate],
  queryFn: () => useLinkActivity(+linkId.value, {
    page: page.value,
    limit: limit.value,
    fromDate: fromDate.value || undefined,
    toDate: toDate.value || undefined,
  }),
})

onServerPrefetch(async () => {
  suspense()
})

const columns = ref<TableColumn<LinkActivityListItem>[]>([
  {
    header: "Time",
    accessorKey: "timestamp",
  },
  {
    header: "Country",
    accessorKey: "country",
  },
  {
    header: "Region",
    accessorKey: "region",
  },
  {
    header: "City",
    accessorKey: "city",
  },
  {
    header: "Device",
    accessorKey: "device",
  },
  {
    header: "OS",
    accessorKey: "os",
  },
  {
    header: "Referrer",
    accessorKey: "referrer",
  },
])
</script>

<template>
  <UCard :ui="{ body: '!px-0' }">
    <UTable :columns="columns" :data="activities?.results" :loading="isLoading">
      <template #timestamp-cell="{ row }">
        {{ useHumanDateTimeWithSeconds(row.original.timestamp) }}
      </template>
    </UTable>
  </UCard>
</template>
