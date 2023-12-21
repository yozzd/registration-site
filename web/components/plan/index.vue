<script setup>
import usePlanStore from '../../stores/plan';
import useModuleStore from '../../stores/module';

const planStore = usePlanStore();
const moduleStore = useModuleStore();

const showCreate = ref(false);
const showEdit = ref(false);
const showRemove = ref(false);

const search = ref('');
const selected = ref([]);
const itemData = ref({});

const page = ref(1);
const pageCount = ref(10);

const columns = [{
  key: 'index',
  label: '#',
  class: 'text-center',
}, {
  key: 'name',
  label: 'Name',
}, {
  key: 'modules',
  label: 'Modules',
}, {
  key: 'actions',
  label: 'Actions',
}];

const {
  status,
  error,
  execute,
} = useAsyncData(() => Promise.all([planStore.getAll(), moduleStore.getAll()]), {
  immediate: false,
});

const items = computed(() => useFilter(planStore.items, search.value, ['name']) || []);
const rows = computed(
  () => items.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value),
);

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() => Math.min(page.value * pageCount.value, items.value.length));

const editDialog = (item) => {
  showEdit.value = true;

  const plan = { ...item };

  const flattenModules = plan.modules.reduce((acc, curr) => {
    acc.push(curr._id);
    return acc;
  }, []);

  plan.modules = flattenModules;
  itemData.value = plan;
};

const closeRemove = () => {
  showRemove.value = false;
  selected.value = [];
};

onMounted(async () => {
  await execute();
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex items-center">
      <div class="text-lg">
        Plans
      </div>
      <div class="ml-auto flex space-x-4">
        <div>
          <UButton
            icon="i-heroicons-plus-20-solid"
            size="lg"
            @click="showCreate = true"
          >
            New
          </UButton>
        </div>

        <div>
          <UButton
            icon="i-heroicons-trash-20-solid"
            size="lg"
            color="red"
            :disabled="selected.length === 0"
            @click="showRemove = true"
          >
            Delete
          </UButton>
        </div>

        <div>
          <UInput
            v-model="search"
            placeholder="Search..."
            icon="i-heroicons-magnifying-glass-20-solid"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                v-show="search !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="search = ''"
              />
            </template>
          </UInput>
        </div>
      </div>
    </div>

    <ErrorHandler
      v-if="error"
      :error="error?.message"
    />

    <div>
      <UTable
        v-model="selected"
        :columns="columns"
        :rows="rows"
        :loading="status === 'pending'"
      >
        <template #index-data="{ index }">
          <div class="text-center">
            {{ index + 1 }}
          </div>
        </template>

        <template #modules-data="{ row }">
          <div
            v-for="item in row.modules"
            :key="item._id"
          >
            <div>{{ item.name }}</div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex space-x-[1rem]">
            <UTooltip text="Edit">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="xs"
                variant="ghost"
                color="primary"
                :padded="false"
                @click="editDialog(row)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </div>

    <div
      v-if="rows.length"
      class="flex items-center justify-end py-4 gap-8"
    >
      <div class="text-primary-600">
        Showing {{ pageFrom }} to {{ pageTo }} of {{ items.length }} results
      </div>
      <USelectMenu
        v-model="pageCount"
        :options="[10, 20, 30, 40, 50]"
        class="w-20"
      />
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="items.length"
      />
    </div>

    <PlanCreate
      v-if="showCreate"
      @close="showCreate = false"
    />

    <PlanEdit
      v-if="showEdit"
      :data="itemData"
      @close="showEdit = false"
    />

    <PlanRemove
      v-if="showRemove"
      :data="selected"
      @close="closeRemove"
    />
  </div>
</template>
