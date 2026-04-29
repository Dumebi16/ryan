export const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit"
  });
};

export const getStatus = (post: any): "draft" | "scheduled" | "published" => {
  if (!post.is_published) return "draft";
  if (post.published_at && new Date(post.published_at) > new Date()) return "scheduled";
  return "published";
};
