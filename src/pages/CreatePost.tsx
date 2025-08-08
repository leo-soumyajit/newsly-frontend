import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import axios from "axios";

const categories = [
  "Sports",
  "Education",
  "Politics",
  "India",
  "Foreign",
  "Health",
  "Tech",
];

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState<null | { type: "success" | "error"; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...files]);

    // Generate preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    const removedPreview = imagePreviews[index];
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) return;

    setSubmitting(true);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setPopup({ type: "error", message: "You must be logged in to create a post." });
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      // Append image files with the correct field name your backend expects:
      imageFiles.forEach((file) => {
        data.append("imageFiles", file); // <-- Corrected field name here
      });

      await axios.post(
        "http://localhost:8000/api/v1/posts/createPost",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setPopup({ type: "success", message: "Your post was published successfully!" });
      setTimeout(() => {
        setPopup(null);
        navigate("/news");
      }, 1500);
    } catch (err) {
      setPopup({
        type: "error",
        message: "Failed to publish your post. Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/news" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News Feed
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
              <CardDescription>
                Share your story with the NewsHub community. Make sure to follow our community guidelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter an engaging title for your post"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="text-lg"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} required disabled={submitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category for your post" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Images</Label>
                  <div className={`border-2 border-dashed border-border rounded-lg p-6 text-center ${submitting ? "opacity-50 pointer-events-none" : ""}`}>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={submitting}
                    />
                    <Label htmlFor="images" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload images or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">Supported formats: any browser-supported image type (e.g. JPG, PNG, WEBP, AVIF)</p>
                      </div>
                    </Label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                            disabled={submitting}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell your story... Share the details, background, and why this matters."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="resize-none"
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 50 characters. Be descriptive and engaging.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {submitting ? "Publishing..." : "Publish Post"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/news")} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card rounded-xl drop-shadow-lg px-8 py-8 flex flex-col items-center text-center border border-border">
            {popup.type === "success" ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <div className="font-bold text-lg mb-1">{popup.message}</div>
                <div className="text-sm text-muted-foreground">Redirecting to News Feed...</div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                <div className="font-bold text-lg mb-1">Error</div>
                <div className="text-sm text-muted-foreground">{popup.message}</div>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => setPopup(null)}>
                  Okay
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
