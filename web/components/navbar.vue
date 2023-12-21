<script setup>
const { data, signOut } = useAuth();

const items = [
  [{
    slot: 'account',
    disabled: true,
  }], [{
    label: 'Settings',
    icon: 'i-solar-settings-linear',
  }], [{
    label: 'Sign out',
    icon: 'i-solar-logout-2-linear',
    click: async () => {
      await signOut({ callbackUrl: '/login' });
    },
  }],
];
</script>

<template>
  <div
    class="
      h-16
      fixed
      left-0
      right-0
      top-0
      z-50
      bg-white
      border-b
      border-primary-100
    "
  >
    <UContainer class="flex items-center h-full justify-between">
      <div class="text-lg font-bold">
        <NuxtLink :to="{ name: 'dashboard' }">
          Dashboard
        </NuxtLink>
      </div>
      <div class="flex items-center">
        <div v-if="data">
          <UDropdown
            :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-end' }"
          >
            <UAvatar :alt="data.user?.fullName" />

            <template #account>
              <div class="text-left">
                <p>
                  {{ data.user?.fullName }}
                </p>
                <p
                  class="
                      truncate
                      font-medium
                      text-primary-900
                    "
                >
                  {{ data.user?.email }}
                </p>
              </div>
            </template>

            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-primary-400 ms-auto"
              />
            </template>
          </UDropdown>
        </div>
      </div>
    </UContainer>
  </div>
</template>
