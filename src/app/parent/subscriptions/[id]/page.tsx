"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// import api from "@/utils/api";
import api from "../../../../lib/api";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Pause,
  PlayArrow,
  Cancel,
  QrCode2,
  CalendarMonth,
  Restaurant,
  LocalShipping,
  Person,
  School,
  LocationOn,
} from "@mui/icons-material";

interface Child {
  _id: string;
  name: string;
  age: number;
  grade: string;
  deliveryLocation: string;
  qrCode: {
    code: string;
    image: string;
  };
}

interface Subscription {
  _id: string;
  parent: string;
  child: Child;
  planType: string;
  mealType: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  deliveryDays: number[];
  statusHistory: Array<{
    status: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface DeliveryStats {
  total: number;
  pending: number;
  delivered: number;
  missed: number;
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats>({
    total: 0,
    delivered: 0,
    pending: 0,
    missed: 0,
  });
  const [qrDialog, setQrDialog] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [params.id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/subscriptions/${params.id}`);
      console.log("Subscription data:", response);

      // Extract data from the API response
      const subscriptionData = response.data.data.subscription;
      const deliveryStatsData = response.data.data.deliveryStats;

      setSubscription(subscriptionData);
      setDeliveryStats(deliveryStatsData);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      setError(
        error.response?.data?.message || "Failed to load subscription details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: "pause" | "cancel") => {
    setActionType(type);
    setActionDialog(true);
  };

  const confirmAction = async () => {
    try {
      setActionLoading(true);
      setError("");

      if (actionType === "pause") {
        await api.put(`/subscriptions/${params.id}/pause`, { reason });
      } else if (actionType === "cancel") {
        await api.put(`/subscriptions/${params.id}/cancel`, { reason });
      }

      setActionDialog(false);
      setReason("");
      await fetchSubscription();
    } catch (error: any) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message || `Failed to ${actionType} subscription`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setError("");
      await api.put(`/subscriptions/${params.id}/resume`);
      await fetchSubscription();
    } catch (error: any) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message || "Failed to resume subscription"
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "cancelled":
      case "canceled":
        return "error";
      case "expired":
        return "default";
      default:
        return "default";
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !subscription) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/parent/subscriptions")}
        >
          Back to Subscriptions
        </Button>
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Subscription not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/parent/subscriptions")}
          sx={{ mt: 2 }}
        >
          Back to Subscriptions
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push("/parent/subscriptions")}
        sx={{ mb: 3 }}
      >
        Back to Subscriptions
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Subscription Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Status and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="h6">Status:</Typography>
              <Chip
                label={subscription.status.toUpperCase()}
                color={getStatusColor(subscription.status)}
                size="medium"
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {subscription.planType.charAt(0).toUpperCase() +
                subscription.planType.slice(1)}{" "}
              Plan
              {" • "}
              {subscription.mealType.charAt(0).toUpperCase() +
                subscription.mealType.slice(1)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {subscription.status === "active" && (
              <>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Pause />}
                  onClick={() => handleAction("pause")}
                >
                  Pause
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleAction("cancel")}
                >
                  Cancel
                </Button>
              </>
            )}
            {subscription.status === "paused" && (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrow />}
                onClick={handleResume}
              >
                Resume
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Child Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Person color="primary" /> Child Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {subscription.child.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <School
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    Age / Grade
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {subscription.child.age} years old, Grade{" "}
                    {subscription.child.grade}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <LocationOn
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    Delivery Location
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {subscription.child.deliveryLocation}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    QR Code
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 1 }}
                  >
                    {subscription.child.qrCode.code}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<QrCode2 />}
                    onClick={() => setQrDialog(true)}
                    fullWidth
                  >
                    View QR Code
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CalendarMonth color="primary" /> Subscription Period
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Start Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(subscription.startDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    End Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(subscription.endDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Plan Type
                  </Typography>
                  <Chip
                    label={subscription.planType.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <Restaurant
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    Meal Type
                  </Typography>
                  <Chip
                    label={subscription.mealType.toUpperCase()}
                    size="small"
                    color="secondary"
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Delivery Days
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {subscription.deliveryDays.map((day) => (
                      <Chip
                        key={day}
                        label={getDayName(day)}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Total Amount Paid
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ₹{subscription.price.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocalShipping color="primary" /> Delivery Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                    elevation={3}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {deliveryStats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Total Meals
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "success.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                    elevation={3}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {deliveryStats.delivered}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Delivered
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "warning.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                    elevation={3}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {deliveryStats.pending}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Pending
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "error.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                    elevation={3}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {deliveryStats.missed}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Missed
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() =>
                  router.push(
                    `/parent/deliveries?child=${subscription.child._id}`
                  )
                }
              >
                View Full Delivery History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Timeline
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(subscription.createdAt)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(subscription.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialog}
        onClose={() => setQrDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Child QR Code</Typography>
          <Typography variant="body2" color="text.secondary">
            {subscription.child.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <img
              src={subscription.child.qrCode.image}
              alt="QR Code"
              style={{ width: "100%", maxWidth: "300px", height: "auto" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: "block" }}
            >
              Code: {subscription.child.qrCode.code}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Show this QR code to the delivery person to confirm meal delivery
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog}
        onClose={() => {
          if (!actionLoading) {
            setActionDialog(false);
            setReason("");
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === "pause" ? "Pause" : "Cancel"} Subscription
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {actionType} this subscription?
          </Typography>
          {actionType === "cancel" && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
              Note: As per our policy, no refunds will be provided for cancelled
              subscriptions.
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
            placeholder={`Why are you ${actionType}ing this subscription?`}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setActionDialog(false);
              setReason("");
            }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === "pause" ? "warning" : "error"}
            onClick={confirmAction}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Confirm ${actionType === "pause" ? "Pause" : "Cancel"}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
