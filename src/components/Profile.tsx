import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AvatarEditor from "react-avatar-editor";
import { User, LogOut, Edit, Camera, ArrowLeft, Trash2, Pencil } from "lucide-react";
import { NewsFeedSkeleton } from "./NewsFeedSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_AVATAR = "/default-avatar.png";

// The fields you'll render/edit (take keys from your API/image)
const POST_FIELDS = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  // Add other fields as in your attachment, such as images, tags, etc as needed
];

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ userName: "", bio: "" });
  const [editLoading, setEditLoading] = useState(false);

  // Image modal/cropping state
  const [showImgEdit, setShowImgEdit] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [scale, setScale] = useState(1.2);

  // Post update/delete UI state
  const [updatingPost, setUpdatingPost] = useState<any | null>(null); // the post being edited
  const [updateForm, setUpdateForm] = useState<any>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null); // show confirmation for post id

  // Editors
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/api/v1/user-profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setProfile(data.data);
          setForm({
            userName: data.data.userName ?? data.data.name ?? "",
            bio: data.data.bio ?? "",
          });
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate("/signin", { replace: true });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 250) return;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
      setEditLoading(false);
      return;
    }

    try {
      const resp = await fetch("http://localhost:8000/api/v1/user-profile/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.userName.trim(), bio: form.bio.trim() }),
      });

      if (!resp.ok) throw new Error();

      setProfile((p: any) => ({ ...p, userName: form.userName.trim(), name: form.userName.trim(), bio: form.bio.trim() }));
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      setEditing(false);
    } catch {
      toast({ variant: "destructive", title: "Update failed", description: "Could not update profile." });
    } finally {
      setEditLoading(false);
    }
  }

  function openImageModal() {
    setShowImgEdit(true);
    setSelectedImage(null);
    setScale(1.2);
  }
  function closeImageModal() {
    setShowImgEdit(false);
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
  };

  async function handleImageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setImgLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
      setImgLoading(false);
      return;
    }
    try {
      if (editorRef.current && selectedImage) {
        const canvas = editorRef.current.getImageScaledToCanvas();
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(b => res(b), "image/png"));
        if (!blob) throw new Error("No image blob");

        const fd = new FormData();
        fd.append("profilePicture", blob, selectedImage.name);
        const resp = await fetch("http://localhost:8000/api/v1/user-profile/updateImage", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!resp.ok) throw new Error();
        const json = await resp.json();

        if (json?.data?.profileImage) {
          setProfile((p: any) => ({ ...p, profileImage: json.data.profileImage }));
          toast({ title: "Profile image updated", description: "Your new profile picture is live!" });
          closeImageModal();
        } else throw new Error();
      }
    } catch {
      toast({ variant: "destructive", title: "Upload failed", description: "Could not upload image." });
    } finally {
      setImgLoading(false);
    }
  }

  // OPEN POST UPDATE MODAL
  function openUpdateModal(post: any) {
    setUpdatingPost(post);
    setUpdateForm({
      title: post.title ?? "",
      description: post.description ?? "",
      // Add other fields as in your attachment
    });
  }
  function closeUpdateModal() {
    setUpdatingPost(null);
    setUpdateLoading(false);
  }

  // POST FIELD CHANGE HANDLER
  function handleUpdateFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setUpdateForm((f: any) => ({ ...f, [name]: value }));
  }

  // POST UPDATE SUBMIT
  // POST UPDATE SUBMIT - FIXED to use FormData!
async function handlePostUpdateSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!updatingPost) return;
  setUpdateLoading(true);
  const token = localStorage.getItem("accessToken");
  try {
    const formData = new FormData();
    formData.append("title", updateForm.title || "");
    formData.append("description", updateForm.description || "");
    // If more fields required by your backend, add them here.

    const resp = await fetch(
      `http://localhost:8000/api/v1/posts/${updatingPost.id}/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type for FormData, browser will handle it!
        },
        body: formData,
      }
    );
    if (!resp.ok) throw new Error();
    setProfile((p: any) => ({
      ...p,
      postsList: p.postsList.map((post: any) =>
        post.id === updatingPost.id ? { ...post, ...updateForm } : post
      ),
    }));
    toast({ title: "Post updated", description: "Your post was updated successfully." });
    closeUpdateModal();
  } catch {
    toast({ variant: "destructive", title: "Update failed", description: "Could not update post." });
    setUpdateLoading(false);
  }
}


  // DELETE POST HANDLER
  async function handleDeletePost(postId: number) {
    const token = localStorage.getItem("accessToken");
    try {
      const resp = await fetch(`http://localhost:8000/api/v1/posts/${postId}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error();
      setProfile((p: any) => ({
        ...p,
        postsList: p.postsList.filter((post: any) => post.id !== postId),
      }));
      toast({ title: "Post deleted", description: "Your post was deleted." });
      setShowDeleteConfirm(null);
    } catch {
      toast({ variant: "destructive", title: "Failed to delete", description: "Could not delete post." });
    }
  }

  if (loading) return <div className="py-16 text-center"><NewsFeedSkeleton /></div>;
  if (!profile) return <div className="py-16 text-center">No profile found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to news */}
      <Button variant="outline" className="mb-6 flex items-center gap-2" onClick={() => navigate("/news")}>
        <ArrowLeft className="h-4 w-4" /> Back to News Feed
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-10">
        <div className="relative group w-32 h-32">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.userName ?? profile.name}
              className="w-full h-full rounded-full object-cover border-4 border-accent shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex justify-center items-center border-4 border-accent shadow-lg">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <button
            onClick={openImageModal}
            className="absolute bottom-2 right-2 bg-accent text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            aria-label="Edit profile image"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 mt-5 md:mt-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{profile.userName ?? profile.name}</h1>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="ml-auto">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>

          {editing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4 bg-muted/10 p-4 rounded-lg max-w-md">
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleInputChange}
                placeholder="Name"
                maxLength={40}
                required
                className="w-full border rounded p-2"
              />
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Bio (max 250 characters)"
                maxLength={250}
                className="w-full border rounded p-2 resize-none"
              />
              <p className="text-xs text-muted-foreground">{form.bio.length} / 250</p>
              <Button type="submit" disabled={editLoading} className="w-full">
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)} className="w-full">
                Cancel
              </Button>
            </form>
          ) : (
            <>
              {profile.bio && <p className="mb-3 text-muted-foreground">{profile.bio}</p>}
              <p className="text-sm"><strong>Email:</strong> {profile.email}</p>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-5">Posts</h2>
        {profile.postsList?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.postsList.map((post: any) => (
              <div
                key={post.id}
                className="relative group border rounded overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* post image/title */}
                <div onClick={() => navigate(`/posts/${post.id}`)}>
                  {post.images?.[0] ? (
                    <img src={post.images[0]} alt={post.title} className="object-cover w-full aspect-square" />
                  ) : (
                    <div className="bg-muted w-full aspect-square flex items-center justify-center text-sm text-muted-foreground">No Image</div>
                  )}
                  {/* Overlay title */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                    <p className="text-white text-sm truncate">{post.title}</p>
                  </div>
                </div>

                {/* Edit/Delete Buttons — only show on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition z-10">
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-white/90 hover:bg-accent text-accent border-none shadow"
                    onClick={e => { e.stopPropagation(); openUpdateModal(post); }}
                    title="Edit post"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-white/90 hover:bg-destructive text-destructive border-none shadow"
                    onClick={e => { e.stopPropagation(); setShowDeleteConfirm(post.id); }}
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Delete Confirm */}
                {showDeleteConfirm === post.id && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded">
                    <p className="text-white font-bold mb-2">Delete this post?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleDeletePost(post.id); }}
                      >
                        Yes, Delete
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={e => { e.stopPropagation(); setShowDeleteConfirm(null); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center my-10">No posts</p>
        )}
      </div>

      {/* Update Post Modal */}
      {updatingPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeUpdateModal}
        >
          <form
            className="bg-background rounded-lg p-6 relative max-w-md w-full"
            onClick={e => e.stopPropagation()}
            onSubmit={handlePostUpdateSubmit}
          >
            <button
              type="button"
              className="absolute top-2 right-2"
              onClick={closeUpdateModal}
            >
              ✕
            </button>
            <h3 className="font-semibold text-lg mb-4">Update Post</h3>

            {POST_FIELDS.map(field =>
              field.type === "textarea" ? (
                <div className="mb-4" key={field.key}>
                  <label className="block font-medium mb-1">{field.label}</label>
                  <textarea
                    name={field.key}
                    value={updateForm[field.key] ?? ""}
                    onChange={handleUpdateFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              ) : (
                <div className="mb-4" key={field.key}>
                  <label className="block font-medium mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.key}
                    value={updateForm[field.key] ?? ""}
                    onChange={handleUpdateFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              )
            )}

            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      )}

      {/* Profile Image Modal (unchanged) */}
      {showImgEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeImageModal}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleImageSubmit}
            className="bg-background rounded-lg p-6 relative max-w-md w-full space-y-4"
          >
            <button
              type="button"
              className="absolute top-2 right-2"
              onClick={closeImageModal}
            >
              ✕
            </button>
            <h3 className="font-semibold text-lg mb-2">Update Profile Picture</h3>
            {!selectedImage ? (
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={onFileChange}
                disabled={imgLoading}
                className="w-full"
              />
            ) : (
              <>
                <AvatarEditor
                  ref={editorRef}
                  image={selectedImage}
                  width={250}
                  height={250}
                  border={40}
                  borderRadius={125}
                  color={[0, 0, 0, 0.5]}
                  scale={scale}
                  rotate={0}
                  className="mx-auto"
                />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={e => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </>
            )}
            <Button type="submit" className="w-full" disabled={imgLoading || !selectedImage}>
              {imgLoading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
