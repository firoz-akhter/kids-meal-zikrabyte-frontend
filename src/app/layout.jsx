import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Kids Meal Subscription",
  description: "Healthy meals delivered to your child's school",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <CssBaseline />
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
