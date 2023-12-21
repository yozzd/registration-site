<script setup>
import { z } from 'zod';
import { useToggle } from '@vueuse/core';

import useUserStore from '../stores/user';

const form = ref();
const typePassword = ref(true);
const typeConfirmPassword = ref(true);

const user = useUserStore();

const state = ref({
  fullName: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const schema = z.object({
  fullName: z.string().min(8),
  email: z.string().email('Invalid email'),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const togglePassword = useToggle(typePassword);
const toggleConfirmPassword = useToggle(typeConfirmPassword);

const {
  data,
  status,
  error,
  execute,
} = useAsyncData(() => user.create(state.value), {
  immediate: false,
});

const submit = async () => {
  await form.value.validate();
  await execute();
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="max-w-md w-full">
      <div
        v-if="data"
        class="flex flex-col items-center"
      >
        <UIcon
          name="i-heroicons-check-20-solid"
          class="w-32 h-32"
        />
        <div class="text-xl">
          Thank you for the registration
        </div>
      </div>

      <div
        v-else
        class="flex flex-col space-y-[2rem]"
      >
        <div class="text-2xl font-bold text-center">
          Registration
        </div>

        <ErrorHandler
          v-if="error"
          :error="error?.message"
        />

        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="flex flex-col space-y-[2rem]"
          @submit="submit"
        >
          <UFormGroup
            label="Full Name"
            name="fullName"
            required
          >
            <UInput v-model="state.fullName" />
          </UFormGroup>
          <UFormGroup
            label="Email"
            name="email"
            required
          >
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup
            label="Password"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              :type="typePassword ? 'password': 'text'"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template
                v-if="state.password"
                #trailing
              >
                <UButton
                  color="gray"
                  variant="link"
                  :icon="typePassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                  :padded="false"
                  @click="togglePassword()"
                />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup
            label="Confirm Password"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="state.confirmPassword"
              :type="typeConfirmPassword ? 'password': 'text'"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template
                v-if="state.confirmPassword"
                #trailing
              >
                <UButton
                  color="gray"
                  variant="link"
                  :icon="typeConfirmPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                  :padded="false"
                  @click="toggleConfirmPassword()"
                />
              </template>
            </UInput>
          </UFormGroup>
          <UButton
            type="submit"
            block
            :loading="status === 'pending'"
          >
            Register
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>
