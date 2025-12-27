import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"worker" | "employer">("worker");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <Stethoscope className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">StaffMedix</span>
          </Link>

          <h1 className="text-4xl font-bold text-primary-foreground mb-6 leading-tight">
            Connect with Verified<br />Healthcare Professionals
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-12 leading-relaxed">
            Join Nigeria's most trusted healthcare recruitment platform. Every professional is verified before appearing on our platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-primary-foreground">2,800+</p>
              <p className="text-sm text-primary-foreground/70">Verified Workers</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-primary-foreground">150+</p>
              <p className="text-sm text-primary-foreground/70">Organizations</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-primary-foreground">100%</p>
              <p className="text-sm text-primary-foreground/70">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StaffMedix</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin ? "Enter your credentials to access your account" : "Join StaffMedix to get started"}
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
            <button
              onClick={() => setUserType("worker")}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                userType === "worker"
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-4 h-4" />
              Healthcare Worker
            </button>
            <button
              onClick={() => setUserType("employer")}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                userType === "employer"
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="w-4 h-4" />
              Employer
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  {userType === "worker" ? "Full Name" : "Organization Name"}
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={userType === "worker" ? "Dr. John Doe" : "Lagos General Hospital"}
                    className="pl-12 h-12 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3">
                <Checkbox id="terms" className="mt-1" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal">
                  Remember me for 30 days
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                {isLogin ? "New to StaffMedix?" : "Already have an account?"}
              </span>
            </div>
          </div>

          {/* Toggle Auth Mode */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create an account" : "Sign in instead"}
          </Button>

          {/* Back to Home */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            <Link to="/" className="text-primary hover:underline inline-flex items-center gap-1">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
