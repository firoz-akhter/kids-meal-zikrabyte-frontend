"use client";

import { Box } from "@mui/material";
// import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminSidebar from "../../components/layout/AdminSidebar";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
