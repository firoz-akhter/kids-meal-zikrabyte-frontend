"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Restaurant,
  QrCode,
  LocalShipping,
  TrendingUp,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isParent, isAdmin } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else if (isParent) {
        router.push("/parent/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, isParent, router]);

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Healthy Meals",
      description:
        "Nutritious lunch and snacks delivered daily to your child's school",
    },
    {
      icon: <QrCode sx={{ fontSize: 50, color: "secondary.main" }} />,
      title: "QR Code Tracking",
      description:
        "Secure delivery verification with unique QR codes for each child",
    },
    {
      icon: <LocalShipping sx={{ fontSize: 50, color: "success.main" }} />,
      title: "Reliable Delivery",
      description: "On-time delivery with real-time status updates",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 50, color: "warning.main" }} />,
      title: "Flexible Plans",
      description: "Weekly or monthly subscriptions that fit your needs",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6B35 0%, #F39C12 100%)",
          color: "white",
          py: 12,
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                Healthy Meals for Happy Kids
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Subscribe to daily meal delivery at your child's school. Fresh,
                nutritious, and hassle-free!
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push("/register")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push("/login")}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 4,
                  p: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  🍎 What's Included
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  ✓ Fresh, healthy meals daily
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  ✓ Customizable for allergies
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  ✓ Vegetarian options available
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  ✓ Weekly menu planning
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ✓ Delivery tracking & updates
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need for worry-free meal subscriptions
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join hundreds of parents who trust us with their children's meals
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/register")}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2024 Kids Meal Subscription. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
