import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

const PASSWORD_MIN_LENGTH = 6;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Reset password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [resetStepEmail, setResetStepEmail] = useState("");
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle main sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);

      if (response.data.data) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        localStorage.setItem("userId", response.data.data.id.toString());

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        navigate("/news");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please check your email and password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password (request)
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      // Validate email pattern
      if (!forgotEmail.match(/^\S+@\S+\.\S+$/)) {
        toast({
          variant: "destructive",
          title: "Invalid email",
          description: "Please enter a valid email address.",
        });
        setForgotLoading(false);
        return;
      }

      await axios.post(
        `http://localhost:8000/api/v1/password-reset/request?email=${encodeURIComponent(forgotEmail)}`
      );
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the reset token.",
      });
      setShowForgotModal(false);
      setForgotLoading(false);
      setResetStepEmail(forgotEmail);
      setShowResetModal(true);
      // Focus new password input when modal opens
      setTimeout(() => newPasswordRef.current?.focus(), 150);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to send reset",
        description: "No account with that email, or network issue.",
      });
      setForgotLoading(false);
    }
  };

  // Handle reset password (with token)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword) return;
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: `Password should be at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
      return;
    }
    setResetLoading(true);
    try {
      await axios.post(
        `http://localhost:8000/api/v1/password-reset/reset?token=${encodeURIComponent(
          resetToken.trim()
        )}&newPassword=${encodeURIComponent(newPassword)}`
      );
      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      });
      setShowResetModal(false);
      setResetToken("");
      setNewPassword("");
      setResetStepEmail("");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: "Invalid or expired reset token.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowForgotModal(false)}
        >
          <form
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-lg p-6 w-full max-w-md relative shadow-xl animate-in fade-in zoom-in"
            onSubmit={handleForgotRequest}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-muted-foreground hover:text-accent text-lg"
              onClick={() => setShowForgotModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold mb-2 text-center">Reset Password</h3>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              We'll send a reset code to your email. Enter your email below.
            </p>
            <Label htmlFor="forgot-email" className="font-medium">
              Email
            </Label>
            <Input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
              autoFocus
              placeholder="Enter your email"
              className="mb-4"
              disabled={forgotLoading}
            />
            <Button disabled={forgotLoading || !forgotEmail} type="submit" className="w-full">
              {forgotLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowResetModal(false)}
        >
          <form
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-lg p-6 w-full max-w-md relative shadow-xl animate-in fade-in zoom-in"
            onSubmit={handleResetPassword}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-muted-foreground hover:text-accent text-lg"
              onClick={() => setShowResetModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold mb-2 text-center">Set New Password</h3>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              Enter the reset code sent to <b>{resetStepEmail}</b>, plus your new password.
            </p>
            <Label htmlFor="reset-token" className="font-medium">
              Reset Code
            </Label>
            <Input
              id="reset-token"
              type="text"
              value={resetToken}
              onChange={e => setResetToken(e.target.value)}
              required
              placeholder="Enter the code"
              className="mb-4"
              autoFocus
              disabled={resetLoading}
            />
            <Label htmlFor="reset-password" className="font-medium">
              New Password
            </Label>
            <Input
              id="reset-password"
              name="new-password"
              type="password"
              minLength={PASSWORD_MIN_LENGTH}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              ref={newPasswordRef}
              placeholder="Enter new password"
              disabled={resetLoading}
              className="mb-2"
            />
            <p className="text-xs mb-3 text-muted-foreground">
              Choose a strong new password, at least {PASSWORD_MIN_LENGTH} characters.
            </p>
            <Button type="submit" disabled={resetLoading || !resetToken || !newPassword} className="w-full">
              {resetLoading ? "Resetting..." : "Set New Password"}
            </Button>
          </form>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your NewsHub account to continue creating and sharing stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-accent hover:text-accent/80 focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-accent hover:text-accent/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
