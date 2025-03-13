<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"

const { user, clear: logout, fetch: fetchUser } = useUserSession()

const menuItems = ref<DropdownMenuItem[][]>(
  [
    [
      {
        label: user?.value?.firstName + " " + user?.value?.lastName,
        avatar: {
          alt: user?.value?.firstName + " " + user?.value?.lastName,
        },
        type: "label",
      },
    ],
    [
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        onSelect: async () => {
          await logout()
          await fetchUser()
          navigateTo({
            name: "auth-signin",
          })
        },
      },
    ],
  ],
)
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="h-12 bg-white shadow">
      <UContainer class="h-full w-full mx-auto flex items-center justify-between gap-x-2">
        <Logo />
        <UDropdownMenu :items="menuItems">
          <UButton
            variant="ghost"
            color="neutral"
            class="p-0 rounded-full"
            :avatar="{
              alt: user?.firstName + ' ' + user?.lastName,
              size: 'md',
            }"
          />
        </UDropdownMenu>
      </UContainer>
    </div>
    <UContainer class="mx-auto w-full py-8">
      <slot />
    </UContainer>
  </div>
</template>
