<script lang="ts" setup>
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const handleVisibilityChange = () => {
  document.hidden
    ? authStore.stopTokenWatcher()
    : authStore.startTokenWatcher();
};

onMounted(() => {
  authStore.initStore();
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  authStore.stopTokenWatcher();
});
</script>

<template>
  <div class="min-h-dvh bg-gray-50 text-black">
    <Toast />

    <!-- Mobile Header -->
    <header
      class="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-30 flex items-center px-4"
    >
      <button @click="sidebarOpen = true">
        <Icon name="mynaui:menu" size="1.4rem" />
      </button>
      <span class="ml-4 font-semibold">Dashboard</span>
    </header>

    <!-- GRID LAYOUT -->
    <div class="h-dvh grid grid-cols-1 md:grid-cols-[11.5rem_1fr] overflow-hidden">
      <!-- Sidebar column -->
      <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main column -->
      <main class="font-montserrat pt-14 md:pt-0 overflow-x-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
