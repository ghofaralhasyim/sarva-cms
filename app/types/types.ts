
export interface ArticleCategory {
    article_category_id: number;
    name: string;
    slug: string;
}

export interface Article {
    article_id: number;
    slug: string;
    title: string;
    thumbnail: string;
    excerpt: string;
    content: string;
    is_external_link: boolean;
    external_url: string;
    created_at: string;
    updated_at: string;
    categories: ArticleCategory[];
}