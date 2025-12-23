<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <div class="p-5 lg:p-8 w-full min-h-dvh overflow-x-auto">
    <h1 class="font-medium mb-4">Booking list</h1>
    <section
      class="border border-gray-200 rounded-md overflow-hidden p-4 bg-white font-montserrat text-sm"
    ></section>
  </div>
</template>
