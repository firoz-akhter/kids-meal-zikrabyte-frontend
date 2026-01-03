"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import NextLink from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          {/* Logo/Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              🍎 Kids Meal
            </Typography>
            <Typography variant="h5" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your meal subscriptions
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </form>

          {/* Quick Login Hints */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Admin:</strong> admin@kidsmeals.com / Admin@123
            </Typography>
          </Box>

          {/* Register Link */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={NextLink}
                href="/register"
                underline="hover"
                fontWeight="bold"
                color="primary"
              >
                Sign Up
              </Link>
            </Typography>
          </Box>

          {/* Back to Home */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link
              component={NextLink}
              href="/"
              underline="hover"
              variant="body2"
              color="text.secondary"
            >
              ← Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
