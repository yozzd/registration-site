<script setup>
import { z } from 'zod';
import useUserStore from '../../stores/user';
import usePlanStore from '../../stores/plan';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);
const userStore = useUserStore();
const planStore = usePlanStore();
const toast = useToast();

const isOpen = ref(true);
const form = ref();

const initState = {
  plan: undefined,
};

const state = ref({ ...props.data });

const schema = z.object({
  plan: z.string(),
});

const {
  status,
  error,
  execute,
} = useAsyncData(() => userStore.update(state.value), {
  immediate: false,
});

const current = computed(() => planStore.items.find((v) => v.slug === state.value.plan));

const close = () => {
  Object.assign(state.value, initState);
  error.value = undefined;
  emit('close');
};

const submit = async () => {
  await form.value?.validate();
  await execute();

  if (!error.value) {
    close();

    toast.add({
      title: 'Done',
      description: 'Data has been updated successfully',
      icon: 'i-solar-check-circle-linear',
    });
  }

  return null;
};
</script>

<template>
  <div>
    <UModal
      v-model="isOpen"
      prevent-close
    >
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="flex flex-col space-y-[2rem]"
        @submit="submit"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-base">
                Edit User
              </div>
              <UButton
                size="sm"
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="close"
              />
            </div>
          </template>

          <div class="flex flex-col space-y-[2rem]">
            <ErrorHandler
              v-if="error"
              :error="error?.message"
            />

            <UFormGroup
              label="Plan"
              name="plan"
            >
              <USelectMenu
                v-model="state.plan"
                :options="planStore.items"
                size="lg"
                value-attribute="slug"
                option-attribute="name"
                searchable
              >
                <template #label>
                  <span>{{ current.name }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex space-x-[1rem]">
              <div class="flex-1" />
              <UButton
                label="Close"
                color="white"
                @click="close"
              />
              <UButton
                label="Save"
                :loading="status === 'pending'"
                type="submit"
              />
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>
