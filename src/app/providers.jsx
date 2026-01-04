"use client";

import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "../context/AuthContext";
import theme from "../theme/theme";

export function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
