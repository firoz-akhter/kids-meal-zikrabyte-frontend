"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Pause, PlayArrow, Cancel, Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get("/subscriptions");
      setSubscriptions(response.data.data.subscriptions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (id) => {
    if (!confirm("Are you sure you want to pause this subscription?")) return;

    try {
      await api.put(`/subscriptions/${id}/pause`, {
        reason: "Paused by user",
      });
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to pause subscription");
    }
  };

  const handleResume = async (id) => {
    try {
      console.log("handleResume", id);
      await api.put(`/subscriptions/${id}/resume`);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resume subscription");
    }
  };

  const handleCancel = async (id) => {
    if (
      !confirm(
        "Are you sure you want to cancel? This cannot be undone and no refund will be issued."
      )
    )
      return;

    try {
      await api.put(`/subscriptions/${id}/cancel`, {
        reason: "Cancelled by user",
      });
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel subscription");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "cancelled":
        return "error";
      case "expired":
        return "default";
      default:
        return "default";
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Subscriptions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your meal subscriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/parent/subscriptions/create")}
        >
          New Subscription
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No subscriptions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first subscription to start meal delivery
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/parent/subscriptions/create")}
            >
              Create Subscription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {subscriptions.map((subscription) => (
            <Grid item xs={12} key={subscription._id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          {subscription.child?.name}
                        </Typography>
                        <Chip
                          label={subscription.status}
                          color={getStatusColor(subscription.status)}
                          size="small"
                        />
                        <Chip
                          label={subscription.planType}
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Meal Type
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {subscription.mealType === "both"
                              ? "Lunch & Snacks"
                              : subscription.mealType.charAt(0).toUpperCase() +
                                subscription.mealType.slice(1)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Start Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {format(
                              new Date(subscription.startDate),
                              "MMM dd, yyyy"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            End Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {format(
                              new Date(subscription.endDate),
                              "MMM dd, yyyy"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">
                            Price
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            ₹{subscription.price}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          router.push(
                            `/parent/subscriptions/${subscription._id}`
                          )
                        }
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>

                      {subscription.status === "active" && (
                        <>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handlePause(subscription._id)}
                            title="Pause"
                          >
                            <Pause />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancel(subscription._id)}
                            title="Cancel"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}

                      {subscription.status === "paused" && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleResume(subscription._id)}
                          title="Resume"
                        >
                          <PlayArrow />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
