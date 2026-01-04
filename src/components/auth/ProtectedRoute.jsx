"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role)
      ) {
        // Redirect to appropriate dashboard if wrong role
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/parent/dashboard");
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }

  return children;
}
