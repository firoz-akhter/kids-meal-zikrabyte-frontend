"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import {
  ChildCare,
  Subscriptions,
  Restaurant,
  TrendingUp,
  Add,
  MenuBook,
  CalendarMonth,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function ParentDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [publishedMenu, setPublishedMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
    fetchMenus();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/parent");
      setDashboard(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await api.get("/menus/parent/all");
      const menus = response.data.data.menus;

      // Find the first published menu
      const published = menus.find((menu) => menu.isPublished === true);

      if (published) {
        setPublishedMenu(published);
        console.log("Published menu:", published);
      }
    } catch (err) {
      console.error("Failed to load menus:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
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
      title: "Total Children",
      value: dashboard?.overview?.totalChildren || 0,
      icon: <ChildCare sx={{ fontSize: 40 }} />,
      color: "#FF6B35",
      bgColor: "#FFF3EE",
    },
    {
      title: "Active Subscriptions",
      value: dashboard?.overview?.activeSubscriptions || 0,
      icon: <Subscriptions sx={{ fontSize: 40 }} />,
      color: "#4ECDC4",
      bgColor: "#E8F8F7",
    },
    {
      title: "Today's Meals",
      value: dashboard?.overview?.todaysMeals || 0,
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: "#2ECC71",
      bgColor: "#E8F8F5",
    },
    {
      title: "Delivery Rate",
      value: `${dashboard?.deliveryStats?.successRate || 0}%`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#F39C12",
      bgColor: "#FEF5E7",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome Back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your children's meals today
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

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/parent/children/add")}
            >
              Add Child
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/parent/subscriptions/create")}
            >
              New Subscription
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/parent/deliveries")}
            >
              View Deliveries
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Children List */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              My Children
            </Typography>
            <Button
              size="small"
              onClick={() => router.push("/parent/children")}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={2}>
            {dashboard?.children?.slice(0, 4).map((child) => (
              <Grid item xs={12} sm={6} md={3} key={child.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => router.push(`/parent/children/${child.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {child.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {child.age} years • Grade {child.grade}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Today's Meals
          </Typography>
          {dashboard?.todaysMeals?.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {dashboard.todaysMeals.map((meal, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    mb: 1,
                    bgcolor: "background.default",
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {meal.child.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.mealType === "lunch" ? "🍱 Lunch" : "🍪 Snacks"}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      meal.status === "delivered"
                        ? "Delivered"
                        : meal.status === "pending"
                        ? "Pending"
                        : "Missed"
                    }
                    color={
                      meal.status === "delivered"
                        ? "success"
                        : meal.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No meals scheduled for today
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Published Weekly Menu */}
      {publishedMenu && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <MenuBook color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  This Week's Menu
                </Typography>
              </Box>
              <Chip
                icon={<CalendarMonth />}
                label={`Week ${publishedMenu.weekNumber}, ${publishedMenu.year}`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                📅 {formatDate(publishedMenu.weekStartDate)} -{" "}
                {formatDate(publishedMenu.weekEndDate)}
              </Typography>
              {publishedMenu.publishedBy && (
                <Typography variant="caption" color="text.secondary">
                  Published by {publishedMenu.publishedBy.name} on{" "}
                  {formatDate(publishedMenu.publishedAt)}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {Object.entries(publishedMenu.days).map(([day, meals]) => {
                const hasLunch = meals.lunch && meals.lunch.length > 0;
                const hasSnacks = meals.snacks && meals.snacks.length > 0;

                // Skip days with no meals
                if (!hasLunch && !hasSnacks) return null;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
                    <Paper
                      sx={{
                        p: 2,
                        height: "100%",
                        bgcolor: "background.default",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                      >
                        {getDayLabel(day)}
                      </Typography>

                      {hasLunch && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            gutterBottom
                          >
                            🍱 Lunch
                          </Typography>
                          {meals.lunch.map((item, idx) => (
                            <Box key={idx} sx={{ mb: 0.5 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                              {item.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.description}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                <Chip
                                  label={
                                    item.category === "veg" ? "Veg" : "Non-Veg"
                                  }
                                  size="small"
                                  color={
                                    item.category === "veg"
                                      ? "success"
                                      : "error"
                                  }
                                  sx={{ height: 20, fontSize: "0.7rem" }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {hasSnacks && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            gutterBottom
                          >
                            🍪 Snacks
                          </Typography>
                          {meals.snacks.map((item, idx) => (
                            <Box key={idx}>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                              {item.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.description}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                <Chip
                                  label={
                                    item.category === "veg" ? "Veg" : "Non-Veg"
                                  }
                                  size="small"
                                  color={
                                    item.category === "veg"
                                      ? "success"
                                      : "error"
                                  }
                                  sx={{ height: 20, fontSize: "0.7rem" }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {publishedMenu.notes && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  📝 Note: {publishedMenu.notes}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {dashboard?.alerts?.expiringSubscriptions?.length > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Subscriptions Expiring Soon
          </Typography>
          {dashboard.alerts.expiringSubscriptions.map((sub, index) => (
            <Typography key={index} variant="body2">
              • {sub.childName}'s subscription expires in {sub.daysRemaining}{" "}
              days
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
}
