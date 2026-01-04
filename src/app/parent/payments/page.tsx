"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import {
  Payment,
  TrendingUp,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data.data.payments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get("/payments/summary");
      console.log("response summary", response);
      setSummary(response.data.data.summary);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
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
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <Payment sx={{ verticalAlign: "middle", mr: 1 }} />
          Payment History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all your payment transactions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{summary.total || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "#FFF3EE",
                      color: "#FF6B35",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <TrendingUp />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{summary.completed?.amount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summary.completed?.count || 0} transactions
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "#E8F8F5",
                      color: "#2ECC71",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <CheckCircle />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{summary.pending?.amount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summary.pending?.count || 0} transactions
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "#FEF5E7",
                      color: "#F39C12",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Schedule />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payments Table */}
      {payments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No payment history
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Child</strong>
                </TableCell>
                <TableCell>
                  <strong>Plan</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Method</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Transaction ID</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{payment.child?.name}</TableCell>
                  <TableCell>
                    {payment.breakdown?.planType} -{" "}
                    {payment.breakdown?.mealType}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{payment.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentMethod}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" fontFamily="monospace">
                      {payment.transactionId || "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
