// src/utils/api.ts
export async function fetchAllPosts() {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:8000/api/v1/posts", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error("Failed to load posts");

  const { data } = await res.json();
  return data.map((raw) => ({
    id: raw.id,
    title: raw.title,
    excerpt: raw.description?.slice(0, 120) || "",
    image: raw.images?.[0] || "",
    category: raw.category,
    publishedAt: new Date(raw.createdAt).toLocaleDateString(),
    readTime: "5 min",
    views: 0,
  }));
}
