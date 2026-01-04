"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "@/lib/api";
import { format } from "date-fns";

export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    fetchDeliveries();
  }, [page, rowsPerPage, filters]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;

      const response = await api.get("/deliveries/admin/history", { params });
      setDeliveries(response.data.data.deliveries);
      setTotalCount(response.data.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load delivery history"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
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
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Delivery History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View past delivery records and performance
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="missed">Missed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Card>

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
                      <strong>Child</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Parent</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Meal Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Time</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Comment</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          py={4}
                        >
                          No delivery records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    deliveries.map((delivery) => (
                      <TableRow key={delivery._id} hover>
                        <TableCell>
                          {format(
                            new Date(delivery.deliveryDate),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {delivery.child?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Age: {delivery.child?.age}
                          </Typography>
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
                          {delivery.child?.deliveryLocation}
                        </TableCell>
                        <TableCell>
                          {delivery.mealType === "lunch"
                            ? "🍱 Lunch"
                            : "🍪 Snacks"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={delivery.status}
                            color={getStatusColor(delivery.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {delivery.deliveredAt
                            ? format(new Date(delivery.deliveredAt), "hh:mm a")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {delivery.comment || "-"}
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
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </>
        )}
      </Card>
    </Box>
  );
}
