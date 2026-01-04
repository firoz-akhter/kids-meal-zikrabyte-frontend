// @ts-nocheck
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
  TablePagination,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Pause,
  PlayArrow,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [page, rowsPerPage, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/subscriptions/admin/all", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          status: statusFilter || undefined,
          search: searchQuery,
        },
      });
      setSubscriptions(response.data.data.subscriptions);
      setTotalCount(response.data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (page === 0) {
        fetchSubscriptions();
      } else {
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleAction = (subscription: any, type: "pause" | "cancel") => {
    setSelectedSubscription(subscription);
    setActionType(type);
    setActionDialog(true);
    setReason("");
  };

  const confirmAction = async () => {
    if (!selectedSubscription || !actionType) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      if (actionType === "pause") {
        await api.put(
          `/subscriptions/${selectedSubscription._id}/pauseByAdmin`,
          {
            reason,
          }
        );
        setSuccess(
          `Subscription for ${selectedSubscription.child?.name} has been paused successfully`
        );
      } else if (actionType === "cancel") {
        await api.put(`/subscriptions/${selectedSubscription._id}/cancel`, {
          reason,
        });
        setSuccess(
          `Subscription for ${selectedSubscription.child?.name} has been cancelled successfully`
        );
      }

      setActionDialog(false);
      setReason("");
      setSelectedSubscription(null);
      await fetchSubscriptions();
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message || `Failed to ${actionType} subscription`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async (subscription: any) => {
    if (
      !confirm(
        `Are you sure you want to resume subscription for ${subscription.child?.name}?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      // console.log("resume/cancel", subscription._id);
      // return;
      await api.put(`/subscriptions/${subscription._id}/resumeByAdmin`);
      setSuccess(
        `Subscription for ${subscription.child?.name} has been resumed successfully`
      );
      await fetchSubscriptions();
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to resume subscription");
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          All Subscriptions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all subscriptions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by parent or child name..."
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
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Parent</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Child</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Plan</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Meal Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Start Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>End Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          py={4}
                        >
                          No subscriptions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={sub._id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {sub.parent?.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {sub.parent?.mobile}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{sub.child?.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={sub.planType}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {/* {sub.mealType === "both"
                            ? "Lunch & Snacks"
                            : sub.mealType.charAt(0).toUpperCase() +
                              sub.mealType.slice(1)} */}
                          -
                        </TableCell>
                        <TableCell>
                          {format(new Date(sub.startDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(sub.endDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {/* ₹{sub.price.toLocaleString("en-IN")} */}-
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.status.toUpperCase()}
                            color={getStatusColor(sub.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={0.5}>
                            {/* <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  router.push(`/admin/subscriptions/${sub._id}`)
                                }
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip> */}

                            {sub.status === "active" && (
                              <>
                                <Tooltip title="Pause Subscription">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => handleAction(sub, "pause")}
                                  >
                                    <Pause fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {/* <Tooltip title="Cancel Subscription">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleAction(sub, "cancel")}
                                  >
                                    <Cancel fontSize="small" />
                                  </IconButton>
                                </Tooltip> */}
                              </>
                            )}

                            {sub.status === "paused" && (
                              <Tooltip title="Resume Subscription">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleResume(sub)}
                                >
                                  <PlayArrow fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog}
        onClose={() => {
          if (!actionLoading) {
            setActionDialog(false);
            setReason("");
            setSelectedSubscription(null);
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
            Are you sure you want to {actionType} the subscription for{" "}
            <strong>{selectedSubscription?.child?.name}</strong>?
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
              setSelectedSubscription(null);
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
