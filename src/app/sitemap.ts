import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { listarPosts } from "@/lib/escola";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = listarPosts();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/para-operadores`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // Índice da Escola: muda sempre que sai post novo.
      url: `${SITE_URL}/escola`,
      lastModified: posts[0] ? new Date(posts[0].data) : now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // Documento legal: indexável (dá confiança e o Google valoriza), mas
      // com prioridade baixa — não é página de aquisição.
      url: `${SITE_URL}/privacidade`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/escola/${post.slug}`,
      lastModified: new Date(post.data),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
