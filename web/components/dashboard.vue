<script setup>
import useUserStore from '../stores/user';
import usePlanStore from '../stores/plan';
import useModuleStore from '../stores/module';

const userStore = useUserStore();
const planStore = usePlanStore();
const moduleStore = useModuleStore();

const {
  error,
  execute,
} = useAsyncData(() => Promise.all([
  userStore.getAll(),
  planStore.getAll(),
  moduleStore.getAll(),
]), {
  immediate: false,
});

const items = [
  { counter: computed(() => userStore.items.length), label: 'Users', link: 'user' },
  { counter: computed(() => planStore.items.length), label: 'Plans', link: 'plan' },
  { counter: computed(() => moduleStore.items.length), label: 'Modules', link: 'module' },
];

onMounted(async () => {
  await execute();
});
</script>

<template>
  <div class="flex flex-col space-y-4">
    <ErrorHandler
      v-if="error"
      :error="error?.message"
    />

    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="(item, index) in items"
        :key="index"
      >
        <NuxtLink
          :to="item.link"
          class="group"
        >
          <div
            class="flex flex-col border rounded-xl px-4 py-4
              transition duration-500 group-hover:bg-gray-50"
          >
            <div class="text-xl font-bold">
              {{ item.counter }}
            </div>
            <div>
              {{ item.label }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
