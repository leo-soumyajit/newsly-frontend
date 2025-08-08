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
  MessageCircle, // Used for WhatsApp
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
}

interface PostData {
  id: number;
  title: string;
  description: string;
  images: string[];
  userName: string;
  userId: number;
  createdAt: string;
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

// Social platform configs
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
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: "#1DA1F2",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: "#0077B5",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle, // fallback
    url: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
    color: "#25D366",
  },
];

const PostDetails: React.FC = () => {
  const { toast } = useToast();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!postId) {
      navigate("/news");
      return;
    }
    const fetchPost = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `http://localhost:8000/api/v1/posts/${postId}`
        );
        if (response.data.apiError) throw new Error(response.data.apiError);
        setPost(response.data.data);
        setComments(response.data.data.comments);
      } catch {
        toast({
          variant: "destructive",
          title: "Failed to load post",
          description: "Redirecting to News Feed.",
        });
        setTimeout(() => {
          navigate("/news");
        }, 2500);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate, toast]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentTrimmed = commentContent.trim();
    if (!contentTrimmed) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
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
      const response = await axios.post(
        `http://localhost:8000/api/v1/comments/${postId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.apiError) throw new Error(response.data.apiError);
      setComments((prev) => [...prev, response.data.data]);
      setShowAllComments(true);
      setCommentContent("");
      toast({
        title: "Comment Posted",
        description: "Your comment was posted successfully.",
      });
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

  const formattedDate = post
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10 min-h-screen bg-background">
        <article className="prose prose-lg max-w-none mx-auto">
          <h1 className="text-4xl font-extrabold leading-tight text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-6">
            <span>By <strong>{post.userName}</strong></span>
            <span>•</span>
            <time dateTime={post.createdAt}>{formattedDate}</time>
            <span>•</span>
            <span className="capitalize">{post.category}</span>
          </div>

          {post.images.length > 0 && (
            <div className="mb-8">
              {post.images.length === 1 ? (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full rounded-lg object-cover max-h-[500px]"
                  loading="lazy"
                />
              ) : (
                <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-rounded">
                  {post.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`${post.title}-${idx}`}
                      className="w-72 h-40 rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="whitespace-pre-line text-lg leading-relaxed text-foreground mb-12">
            {post.description}
          </div>

          {/* --- Comments Row (avatar/share + input) --- */}
          <section className="border-t border-muted-foreground pt-8 mt-8 relative">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              Comments <span className="text-base font-medium text-muted-foreground">({totalComments})</span>
            </h2>
            {/* Comment input area: avatar/share button at left, then textarea/button */}
            <form
              onSubmit={handleCommentSubmit}
              className="mb-10 flex space-x-4 items-start bg-muted/30 px-4 py-5 rounded-xl shadow-inner"
            >
              {/* Placement is exactly as shown in your image reference */}
              <div className="relative flex-shrink-0 flex flex-col items-center justify-center">
                <button
                  aria-expanded={shareOpen}
                  aria-haspopup="true"
                  onClick={() => setShareOpen((v) => !v)}
                  className="rounded-full bg-primary p-4 shadow-lg text-white hover:bg-primary/80 transition-colors focus:outline-none"
                  title="Share this post"
                  type="button"
                  style={{
                    boxShadow: "0 5px 24px 0 rgb(30 52 90 / 12%)",
                  }}
                >
                  <Share2 className="h-6 w-6" />
                </button>
                {/* Animated share menu */}
                <div
                  className={`absolute left-0 top-14 z-20 flex flex-col space-y-2 bg-card rounded-2xl p-4 shadow-xl transition-all ${
                    shareOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  style={{
                    minWidth: 210,
                    boxShadow: "0 2px 12px 0 rgb(35 45 90 / 14%)",
                  }}
                  role="menu"
                  aria-hidden={!shareOpen}
                >
                  {sharePlatforms.map(({ name, icon: Icon, url, color }) => (
                    <a
                      key={name}
                      href={url(currentUrl, post.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      style={{ color }}
                      title={`Share on ${name}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{name}</span>
                    </a>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-center text-xs mt-2"
                    onClick={() => setShareOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              {/* Textarea (will stretch to fill row space) */}
              <div className="flex-1 flex flex-col">
                <Textarea
                  ref={textareaRef}
                  placeholder="Write your comment…"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={2}
                  required
                  disabled={submitting}
                  className="resize-none rounded-md border border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary shadow-sm font-medium transition"
                  style={{ minHeight: 44, maxHeight: 200, fontSize: "1.05rem" }}
                />
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={submitting || commentContent.trim() === ""}
                    className="flex items-center space-x-2 font-bold px-4 py-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? "Posting..." : "Post"}</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {totalComments === 0 ? (
              <p className="text-muted-foreground italic">No comments yet. Be the first!</p>
            ) : (
              <div className="flex flex-col gap-7">
                {totalComments > MAX_DISPLAY_COMMENTS && (
                  <div className="flex justify-center mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[0.96rem] font-semibold rounded-lg px-2.5 py-1.5 bg-muted/50 hover:bg-primary/10"
                      onClick={() => setShowAllComments((v) => !v)}
                      type="button"
                    >
                      {showAllComments ? (
                        <>
                          <ChevronsUp className="h-4 w-4 mr-1" /> Show less
                        </>
                      ) : (
                        <>
                          <ChevronsDown className="h-4 w-4 mr-1" />
                          Show all {totalComments} comments
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <ul className="divide-y divide-muted-foreground/10 rounded-lg overflow-hidden bg-muted/30">
                  {commentsToShow.map((c) => (
                    <li key={c.id} className="flex items-start gap-4 px-5 py-5 transition hover:bg-white/50">
                      <div
                        className="flex-shrink-0 h-11 w-11 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center font-bold text-white text-lg uppercase shadow"
                        title={c.userName}
                      >
                        {c.userName
                          .split(" ")
                          .map((str) => str.charAt(0))
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {c.userName}
                          </span>
                          <time className="text-xs text-muted-foreground ml-1" title={new Date(c.createdAt).toLocaleString()}>
                            {new Date(c.createdAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </time>
                        </div>
                        <div className="mt-1 text-foreground text-[1.02rem] whitespace-pre-wrap leading-relaxed break-words">
                          {c.content}
                        </div>
                      </div>
                    </li>
                  ))}
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
