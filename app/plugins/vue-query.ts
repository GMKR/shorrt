import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query"
import {
  MutationCache,
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from "@tanstack/vue-query"
// Nuxt 3 app aliases
import type { NuxtError } from "#app"
import { defineNuxtPlugin, useState } from "#imports"

declare module "@tanstack/vue-query" {
  interface Register {
    defaultError: NuxtError<{ message: string, url: string }>
  }
}

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query")

  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
    mutationCache: new MutationCache({
      onError: (error) => {
        const ignoreUrls = ["/api/auth/verify", "/api/auth/resetpassword"]
        const toast = useToast()
        if (!ignoreUrls.some(url => error?.data?.url?.startsWith(url))) {
          toast.add({
            title: error.statusMessage,
            description: error?.data?.message || "Something went wrong",
            color: "error",
          })
        }
      },
    }),
  })
  const options: VueQueryPluginOptions = { queryClient }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
