"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  People,
  ChildCare,
  Subscriptions,
  Restaurant,
  TrendingUp,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/admin");
      setDashboard(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const stats = [
    {
      title: "Total Parents",
      value: dashboard?.overview?.totalParents || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#FF6B35",
      bgColor: "#FFF3EE",
    },
    {
      title: "Total Children",
      value: dashboard?.overview?.totalChildren || 0,
      icon: <ChildCare sx={{ fontSize: 40 }} />,
      color: "#4ECDC4",
      bgColor: "#E8F8F7",
    },
    {
      title: "Active Subscriptions",
      value: dashboard?.overview?.activeSubscriptions || 0,
      icon: <Subscriptions sx={{ fontSize: 40 }} />,
      color: "#2ECC71",
      bgColor: "#E8F8F5",
    },
    {
      title: "Today's Meals",
      value: dashboard?.overview?.todaysMeals || 0,
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: "#F39C12",
      bgColor: "#FEF5E7",
    },
  ];

  const successRate = dashboard?.weeklyPerformance?.successRate || 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard 📊
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your meal subscription platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Deliveries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Today's Deliveries
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Pending</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboard?.todaysDeliveries?.pending || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="success.main">
                    Delivered
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {dashboard?.todaysDeliveries?.delivered || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="error.main">
                    Missed
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="error.main"
                  >
                    {dashboard?.todaysDeliveries?.missed || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Subscriptions
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle fontSize="small" color="success" />
                    <Typography variant="body2">Active</Typography>
                  </Box>
                  <Chip
                    label={dashboard?.subscriptions?.active || 0}
                    color="success"
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Paused</Typography>
                  <Chip
                    label={dashboard?.subscriptions?.paused || 0}
                    color="warning"
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Cancel fontSize="small" color="error" />
                    <Typography variant="body2">Cancelled</Typography>
                  </Box>
                  <Chip
                    label={dashboard?.subscriptions?.cancelled || 0}
                    color="error"
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Expired</Typography>
                  <Chip
                    label={dashboard?.subscriptions?.expired || 0}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Weekly Delivery Performance
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Success Rate</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {successRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(successRate)}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    Total: {dashboard?.weeklyPerformance?.total || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Delivered: {dashboard?.weeklyPerformance?.delivered || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <TrendingUp sx={{ verticalAlign: "middle", mr: 1 }} />
                Current Month Revenue
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  ₹{dashboard?.revenue?.currentMonth || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboard?.revenue?.transactions || 0} transactions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  New subscriptions (Last 7 days):{" "}
                  {dashboard?.recentActivity?.newSubscriptionsLast7Days || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
