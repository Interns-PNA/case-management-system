import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "../auth.css";
import naLogo from "../assets/na.png";
import { toast, Toaster } from "sonner";

export default function LoginForm(props) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/authenticate",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      // Store user data using AuthContext
      login(response.data.user);

      // Show Sonner toast on top
      toast.success("Login successful!", {
        position: "top-center",
        style: {
          fontSize: "1.15rem",
          fontWeight: 700,
          background: "#1e293b",
          color: "#fff",
          boxShadow: "0 4px 24px rgba(30,41,59,0.18)",
          borderRadius: "10px",
          padding: "18px 32px",
        },
        iconTheme: {
          primary: "#2563eb",
          secondary: "#fff",
        },
      });

      // Delay navigation so toast is visible
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-right">
            <a
              href="https://na.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-image-placeholder"
            >
              <img
                src={naLogo}
                alt="National Assembly"
                style={{ width: 150, height: 150, opacity: 0.8 }}
              />
              <span className="text-muted-foreground">
                Welcome to the National Assembly of Pakistan
              </span>
            </a>
          </div>
          <div className="auth-left">
            <a
              href="https://na.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-logo"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={naLogo}
                alt="National Assembly"
                style={{ width: "40px", height: "40px" }}
              />
              <span className="font-semibold text-lg text-gray-600">
                National Assembly of Pakistan
              </span>
            </a>
            <form
              className="flex flex-col gap-6"
              style={{ minWidth: 320 }}
              onSubmit={handleLogin}
              {...props}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your username below to login to your account
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    placeholder="**********"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#2563eb", color: "white" }}
                  className="w-full"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
