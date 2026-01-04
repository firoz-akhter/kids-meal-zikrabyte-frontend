"use client";

import { Box } from "@mui/material";
// import ParentSidebar from "@/components/layout/ParentSidebar";
import ParentSidebar from "../../components/layout/ParentSidebar";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function ParentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <ParentSidebar />
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
