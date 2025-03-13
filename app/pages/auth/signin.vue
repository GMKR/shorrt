<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { useMutation } from "@tanstack/vue-query"

const state = reactive<Partial<AuthSignInBody>>({
  email: undefined,
  password: undefined,
})

const { mutate: signin, isPending } = useMutation({
  mutationFn: (data: AuthSignInBody) => useAuthSignIn(data),
  onSuccess: async () => {
    await useHandleAuthSuccess()
  },
})

const onSubmit = async (event: FormSubmitEvent<AuthSignInBody>) => {
  signin(event.data)
}

useHead({
  title: "SignIn",
})
</script>

<template>
  <UCard class="w-full max-w-lg">
    <template #header>
      <h2 class="text-lg font-bold">
        User Login
      </h2>
    </template>
    <UForm
      :state="state"
      :schema="AuthSignInBodySchema"
      @submit="onSubmit"
    >
      <UFormField
        name="email"
        label="Email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="username"
        />
      </UFormField>
      <UFormField
        name="password"
        label="Password"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
        />
      </UFormField>
      <UButton
        type="submit"
        :loading="isPending"
        label="Login"
        block
        size="xl"
      />
    </UForm>
  </UCard>
</template>
