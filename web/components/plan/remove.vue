<script setup>
import usePlanStore from '../../stores/plan';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close']);
const store = usePlanStore();
const toast = useToast();

const isOpen = ref(true);

const {
  status,
  error,
  execute,
} = useAsyncData(() => store.remove(props.data), {
  immediate: false,
});

const close = () => {
  error.value = undefined;
  emit('close');
};

const submit = async () => {
  await execute();

  if (!error.value) {
    close();

    toast.add({
      title: 'Done',
      description: 'Data has been deleted successfully',
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
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-base">
              Delete Plan
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

          <div>
            This action will delete the data permanently, Continue?
          </div>
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
              label="Yes"
              color="red"
              :loading="status === 'pending'"
              @click="submit"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
