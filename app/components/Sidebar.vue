<script lang="ts" setup>
const authStore = useAuthStore();
const route = useRoute();

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

function handleLogout() {
  authStore.logout();
}

function isActive(path: string) {
  return route.path.startsWith(path);
}

const navs = [
  {
    url: "/bookings",
    baseUrl: "/bookings",
    text: "Bookings",
    icon: "mynaui:file-text",
  },
  {
    url: "/rooms",
    baseUrl: "/rooms",
    text: "Room setting",
    icon: "mynaui:building",
  },
];
</script>
<template>
  <!-- Backdrop (mobile only) -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="$emit('close')"
  />

  <nav
    class="bg-white border-r border-black/10 h-dvh py-5 flex flex-col justify-between w-46 z-50 fixed md:static transform transition-transform duration-300 md:translate-x-0"
    :class="{
      '-translate-x-full': !isOpen,
      'translate-x-0': isOpen,
    }"
  >
    <ul class="flex flex-col items-center">
      <li class="w-full px-5 py-4 text-sm text-left font-light text-gray-400">
        Menu
      </li>
      <li v-for="(nav, idx) in navs" :key="idx" class="w-full flex relative">
        <span
          v-if="isActive(nav.baseUrl)"
          class="absolute left-0 w-1 inset-y-3 rounded-r-lg bg-indigo-500"
        ></span>
        <NuxtLink
          :to="nav.url"
          class="w-full flex items-center gap-2 px-4 py-3 font-light"
          :class="{ 'text-indigo-500 font-semibold': isActive(nav.baseUrl) }"
          @click="emit('close')"
        >
          <Icon :name="nav.icon" size="1.25rem" />
          <span class="text-sm">{{ nav.text }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
