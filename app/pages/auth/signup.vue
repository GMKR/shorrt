<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { useMutation } from "@tanstack/vue-query"

const state = reactive<Partial<AuthSignUpBody>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
})

const { mutate: signin, isPending } = useMutation({
  mutationFn: (data: AuthSignUpBody) => useAuthSignup(data),
  onSuccess: () => {
    navigateTo({
      name: "auth-signin",
    })
  },
})

const onSubmit = async (event: FormSubmitEvent<AuthSignUpBody>) => {
  signin(event.data)
}

useHead({
  title: "SignUp",
})
</script>

<template>
  <UCard class="w-full max-w-lg">
    <template #header>
      <h2 class="text-lg font-bold">
        Create an account
      </h2>
    </template>
    <UForm
      :state="state"
      :schema="AuthSignUpBodySchema"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          name="firstName"
          label="First Name"
          required
        >
          <UInput
            v-model="state.firstName"
            autocomplete="given-name"
          />
        </UFormField>
        <UFormField
          name="lastName"
          label="Last Name"
          required
        >
          <UInput
            v-model="state.lastName"
            autocomplete="family-name"
          />
        </UFormField>
      </div>

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
          autocomplete="new-password"
        />
      </UFormField>
      <UButton
        type="submit"
        :loading="isPending"
        block
        size="xl"
        label="Create Account"
      />
    </UForm>
  </UCard>
</template>
