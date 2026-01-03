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
} from "@mui/material";
import { Search } from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, [page, rowsPerPage, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {sub.parent?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
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
                      <TableCell>{sub.mealType}</TableCell>
                      <TableCell>
                        {format(new Date(sub.startDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(sub.endDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>₹{sub.price}</TableCell>
                      <TableCell>
                        <Chip
                          label={sub.status}
                          color={getStatusColor(sub.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
