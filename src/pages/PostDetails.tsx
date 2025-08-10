import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import {
  Send,
  ChevronsDown,
  ChevronsUp,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userName: string;
  userId: number;
  postId: number;
  profileImage?: string | null;
}

interface PostData {
  id: number;
  title: string;
  description: string;
  images: string[];
  userName: string;
  userId: number;
  createdAt: string;
  profileImage?: string | null;
  comments: Comment[];
  category: string;
  likes: number;
}

interface ApiResponse {
  localDateTime: string;
  data: PostData;
  apiError: null | string;
}

const MAX_DISPLAY_COMMENTS = 5;
const DEFAULT_AVATAR_BG =
  "bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center font-bold text-white";

const sharePlatforms = [
  {
    name: "Facebook",
    icon: Facebook,
    url: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "#1877F2",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    color: "#1DA1F2",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    color: "#0077B5",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        title
      )}%20${encodeURIComponent(url)}`,
    color: "#25D366",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Edit/delete states
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get logged-in user ID (set in localStorage on login)
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!postId) {
      navigate("/news");
      return;
    }
    const fetchPost = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `http://localhost:8000/api/v1/posts/${postId}`
        );
        if (res.data.apiError) throw new Error(res.data.apiError);
        setPost(res.data.data);
        setComments(res.data.data.comments);
      } catch {
        toast({
          variant: "destructive",
          title: "Failed to load post",
          description: "Redirecting to News Feed.",
        });
        setTimeout(() => navigate("/news"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate, toast]);

  // --- Add new comment ---
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentTrimmed = commentContent.trim();
    if (!contentTrimmed) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Not Authorized",
        description: "You must be logged in to comment.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { content: contentTrimmed };
      const res = await axios.post(
        `http://localhost:8000/api/v1/comments/${postId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.apiError) throw new Error(res.data.apiError);

      setComments((prev) => [...prev, res.data.data]);
      setShowAllComments(true);
      setCommentContent("");
      toast({ title: "Comment Posted", description: "Comment added successfully." });
      textareaRef.current?.focus();
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to Post Comment",
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- Update Comment ---
  const handleEditClick = (comment: Comment) => {
    setEditCommentId(comment.id);
    setEditInput(comment.content);
  };

  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditInput("");
  };

  const handleEditSave = async (comment: Comment) => {
    if (!editInput.trim() || editInput.trim() === comment.content) {
      handleEditCancel();
      return;
    }
    setEditLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `http://localhost:8000/api/v1/comments/${comment.id}/post/${comment.postId}`,
        { content: editInput.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, content: editInput.trim() } : c
        )
      );
      toast({ title: "Comment Updated", description: "Comment updated successfully." });
      handleEditCancel();
    } catch {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update comment.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // --- Delete Comment ---
  const handleDeleteClick = (cid: number) => {
    setDeleteConfirmId(cid);
  };

  const handleDeleteConfirm = async (comment: Comment) => {
    setDeleteLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/comments/${comment.id}/post/${comment.postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
      setDeleteConfirmId(null);
      toast({ title: "Comment Deleted", description: "Comment deleted successfully." });
    } catch {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not delete comment.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NewsFeedSkeleton />
      </div>
    );
  }
  if (!post) return null;

  const totalComments = comments.length;
  const commentsToShow =
    showAllComments || totalComments <= MAX_DISPLAY_COMMENTS
      ? comments
      : comments.slice(-MAX_DISPLAY_COMMENTS);

  const currentUrl = window.location.href;
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <article>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-extrabold">{post.title}</h1>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShareOpen((prev) => !prev)}
                className="rounded-full bg-primary p-3 text-white hover:bg-primary/80 transition"
                title="Share this post"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Share Menu */}
              {shareOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card rounded-xl shadow-lg p-3 space-y-1 z-10">
                  {sharePlatforms.map(({ name, icon: Icon, url, color }) => (
                    <a
                      key={name}
                      href={url(currentUrl, post.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted transition"
                      style={{ color }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{name}</span>
                    </a>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setShareOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            {post.profileImage ? (
              <img
                src={post.profileImage}
                alt={post.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full ${DEFAULT_AVATAR_BG}`}>
                {initials(post.userName)}
              </div>
            )}
            <span className="font-semibold">{post.userName}</span>
            <span>•</span>
            <time>{formattedDate}</time>
            <span>•</span>
            <span className="bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded text-xs font-semibold">
              {post.category}
            </span>
          </div>

          {post.images.length > 0 && (
            <div className="mb-8">
              {post.images.length === 1 ? (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full rounded-lg object-cover max-h-[500px]"
                />
              ) : (
                <div className="flex overflow-x-auto space-x-4">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${post.title}-${i}`}
                      className="w-72 h-40 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="whitespace-pre-line mb-12">{post.description}</p>

          {/* Comments Section */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">
              Comments ({totalComments})
            </h2>
            <form
              onSubmit={handleCommentSubmit}
              className="mb-10 flex space-x-4 items-start bg-muted/30 p-4 rounded-xl shadow-inner"
            >
              <div className="flex-1 flex flex-col">
                <Textarea
                  ref={textareaRef}
                  placeholder="Write your comment…"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                  disabled={submitting}
                  rows={2}
                  className="resize-none"
                />
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={!commentContent.trim() || submitting}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {submitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>

            {totalComments === 0 ? (
              <p className="italic text-muted-foreground">
                No comments yet. Be the first!
              </p>
            ) : (
              <div>
                {totalComments > MAX_DISPLAY_COMMENTS && (
                  <div className="flex justify-center mb-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllComments((v) => !v)}
                    >
                      {showAllComments ? (
                        <>
                          <ChevronsUp className="mr-1" /> Show less
                        </>
                      ) : (
                        <>
                          <ChevronsDown className="mr-1" /> Show all{" "}
                          {totalComments}
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <ul className="divide-y divide-muted-foreground/10 bg-muted/30 rounded-lg">
                  {commentsToShow.map((c) => {
                    const isOwn = userId === c.userId;
                    const isEditing = editCommentId === c.id;
                    const isDeleting = deleteConfirmId === c.id;
                    return (
                      <li
                        key={c.id}
                        className={`flex gap-4 group hover:bg-white/70 dark:hover:bg-background/60 p-5 relative transition`}
                      >
                        {c.profileImage ? (
                          <img
                            src={c.profileImage}
                            alt={c.userName}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-11 h-11 rounded-full ${DEFAULT_AVATAR_BG}`}
                            title={c.userName}
                          >
                            {initials(c.userName)}
                          </div>
                        )}

                        {/* ---- MAIN COMMENT BODY ---- */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{c.userName}</span>
                            <time className="text-xs text-muted-foreground">
                              {new Date(c.createdAt).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </time>
                          </div>
                          {/* COMMENT CONTENT or EDIT FIELD */}
                          {isEditing ? (
                            <div className="mt-2 flex flex-col gap-2">
                              <Textarea
                                value={editInput}
                                rows={2}
                                autoFocus
                                required
                                onChange={(e) => setEditInput(e.target.value)}
                                disabled={editLoading}
                                className="resize-none border-accent"
                              />
                              <div className="flex gap-2 mt-1">
                                <Button
                                  size="sm"
                                  type="button"
                                  disabled={editLoading}
                                  onClick={() => handleEditSave(c)}
                                  className="px-2"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                  disabled={editLoading}
                                  onClick={handleEditCancel}
                                  className="px-2"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-1 whitespace-pre-wrap text-[1.03rem]">
                              {c.content}
                            </p>
                          )}
                        </div>

                        {/* --- EDIT/DELETE ICONS, only for own comments, only on hover --- */}
                        {isOwn && !isEditing && !isDeleting && (
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                            <button
                              title="Edit comment"
                              className="p-1 hover:bg-accent/20 rounded transition"
                              onClick={() => handleEditClick(c)}
                            >
                              <Pencil className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              title="Delete comment"
                              className="p-1 hover:bg-accent/20 rounded transition"
                              onClick={() => handleDeleteClick(c.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}

                        {/* --- DELETE CONFIRMATION --- */}
                        {isOwn && isDeleting && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded">
                            <div className="bg-white dark:bg-background border p-6 rounded-lg shadow space-y-3 flex flex-col items-center">
                              <span className="font-semibold text-lg text-destructive">Delete this comment?</span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={deleteLoading}
                                  onClick={() => handleDeleteConfirm(c)}
                                >
                                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteConfirmId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        </article>
      </main>
    </>
  );
};

export default PostDetails;
