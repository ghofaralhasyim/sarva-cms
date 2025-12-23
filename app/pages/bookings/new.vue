<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <SubMenu>
    <ArticleSubMenu />
  </SubMenu>
  <div class="p-8 w-full h-dvh overflow-x-auto">
    <TiptapEditor />
  </div>
</template>
