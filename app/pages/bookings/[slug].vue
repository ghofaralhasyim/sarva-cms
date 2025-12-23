<script lang="ts" setup>
import type { Article } from "~/types/types";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const toastStore = useToastStore();
const isLoading = ref<boolean>(true);

interface ReqArticleResponse {
  data: Article;
  message: string;
}

const route = useRoute();

const {
  data: dataArticle,
  error,
  pending,
  refresh: refreshDataArticle,
} = useApiFetch<ReqArticleResponse>(`/articles/${route.params.slug}`);
</script>

<template>
  <SubMenu>
    <ArticleSubMenu />
  </SubMenu>
  <div v-if="dataArticle" class="p-8 w-full h-dvh overflow-x-auto">
    <ArticleEditor :data="dataArticle.data" @updated="refreshDataArticle" />
  </div>
</template>
