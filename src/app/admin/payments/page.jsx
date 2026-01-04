"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
} from "@mui/material";
import {
  TrendingUp,
  Payment as PaymentIcon,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
// import api from '@/lib/api';
import api from "../../../lib/api";
import { format } from "date-fns";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [page, rowsPerPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payments/admin/all", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setPayments(response.data.data.payments);
      setTotalCount(response.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/payments/admin/stats");
      setStats(response.data.data.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all payment transactions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
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
                      Total Revenue
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{stats.overall?.totalAmount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.overall?.total || 0} transactions
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
                      ₹{stats.overall?.completed?.amount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.overall?.completed?.count || 0} payments
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
                      ₹{stats.overall?.pending?.amount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.overall?.pending?.count || 0} payments
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
                      Failed
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹{stats.overall?.failed?.amount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.overall?.failed?.count || 0} payments
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "#FADBD8",
                      color: "#E74C3C",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <PaymentIcon />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payments Table */}
      <Card>
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
                      <strong>Date</strong>
                    </TableCell>
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
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          py={4}
                        >
                          No payments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment._id} hover>
                        <TableCell>
                          {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {payment.parent?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.parent?.mobile}
                          </Typography>
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
    </Box>
  );
}
