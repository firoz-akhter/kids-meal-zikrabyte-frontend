"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  Cancel,
  QrCodeScanner,
  Refresh,
} from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'delivered' or 'missed'
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/deliveries/admin/today", {
        params: { search: searchQuery },
      });
      setDeliveries(response.data.data.deliveries);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/deliveries/admin/stats");
      setStats(response.data.data.overall);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleOpenDialog = (delivery, type) => {
    setSelectedDelivery(delivery);
    setDialogType(type);
    setComment("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDelivery(null);
    setComment("");
  };

  const handleSubmitStatus = async () => {
    if (!selectedDelivery) return;

    if (dialogType === "missed" && !comment) {
      alert("Please provide a reason for marking as missed");
      return;
    }

    setSubmitting(true);

    try {
      if (dialogType === "delivered") {
        await api.put(`/deliveries/${selectedDelivery._id}/delivered`, {
          comment,
          qrScanned: false,
        });
      } else {
        await api.put(`/deliveries/${selectedDelivery._id}/missed`, {
          reason: comment,
        });
      }

      handleCloseDialog();
      fetchDeliveries();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update delivery");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchDeliveries();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "pending":
        return "warning";
      case "missed":
        return "error";
      default:
        return "default";
    }
  };

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
            Today's Deliveries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track today's meal deliveries
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            fetchDeliveries();
            fetchStats();
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold">
                  {stats.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Deliveries
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ p: 2, textAlign: "center", bgcolor: "warning.light" }}>
                <Typography variant="h4" fontWeight="bold">
                  {stats.pending || 0}
                </Typography>
                <Typography variant="body2">Pending</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ p: 2, textAlign: "center", bgcolor: "success.light" }}>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {stats.delivered || 0}
                </Typography>
                <Typography variant="body2" color="white">
                  Delivered
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ p: 2, textAlign: "center", bgcolor: "error.light" }}>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {stats.missed || 0}
                </Typography>
                <Typography variant="body2" color="white">
                  Missed
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by child name or school..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Child</strong>
                  </TableCell>
                  <TableCell>
                    <strong>School</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Meal Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Parent Contact</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No deliveries for today
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  deliveries.map((delivery) => (
                    <TableRow key={delivery._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {delivery.child?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Age: {delivery.child?.age} | Grade:{" "}
                          {delivery.child?.grade}
                        </Typography>
                      </TableCell>
                      <TableCell>{delivery.child?.deliveryLocation}</TableCell>
                      <TableCell>
                        {delivery.mealType === "lunch"
                          ? "🍱 Lunch"
                          : "🍪 Snacks"}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {delivery.child?.parent?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {delivery.child?.parent?.mobile}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={delivery.status}
                          color={getStatusColor(delivery.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {delivery.status === "pending" && (
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleOpenDialog(delivery, "delivered")
                              }
                              title="Mark Delivered"
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleOpenDialog(delivery, "missed")
                              }
                              title="Mark Missed"
                            >
                              <Cancel />
                            </IconButton>
                          </Box>
                        )}
                        {delivery.status === "delivered" && (
                          <Typography variant="caption" color="text.secondary">
                            ✓ Completed
                          </Typography>
                        )}
                        {delivery.status === "missed" && (
                          <Typography variant="caption" color="text.secondary">
                            {delivery.comment}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Status Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "delivered" ? "Mark as Delivered" : "Mark as Missed"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Child: <strong>{selectedDelivery?.child?.name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Meal: <strong>{selectedDelivery?.mealType}</strong>
          </Typography>
          <TextField
            fullWidth
            label={
              dialogType === "delivered"
                ? "Comment (optional)"
                : "Reason (required)"
            }
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              dialogType === "delivered"
                ? "e.g., Delivered to class teacher"
                : "e.g., Child absent, School holiday"
            }
            required={dialogType === "missed"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitStatus}
            disabled={submitting}
            color={dialogType === "delivered" ? "success" : "error"}
          >
            {submitting ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
