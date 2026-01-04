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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { LocalShipping, Restaurant } from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (children.length > 0) {
      fetchDeliveries();
    }
  }, [selectedChild, children, selectedStatus]);

  const fetchChildren = async () => {
    try {
      const response = await api.get("/children");
      setChildren(response.data.data.children);
    } catch (err) {
      console.error("Failed to fetch children:", err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      let url = "/deliveries/today";

      if (selectedChild !== "all") {
        url = `/deliveries/child/${selectedChild}`;
      }

      const response = await api.get(url);
      let deliveriesData = response.data.data.deliveries || [];

      // Filter by status if needed
      if (selectedStatus !== "all") {
        deliveriesData = deliveriesData.filter(
          (d) => d.status === selectedStatus
        );
      }

      setDeliveries(deliveriesData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
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

  if (loading && deliveries.length === 0) {
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
          <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
          Delivery History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your children's meal deliveries
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Child</InputLabel>
                <Select
                  value={selectedChild}
                  label="Filter by Child"
                  onChange={(e) => setSelectedChild(e.target.value)}
                >
                  <MenuItem value="all">All Children</MenuItem>
                  {children.map((child) => (
                    <MenuItem key={child._id} value={child._id}>
                      {child.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Filter by Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="missed">Missed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      {deliveries.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No deliveries found
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
                  <strong>Meal Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Delivered At</strong>
                </TableCell>
                <TableCell>
                  <strong>Comment</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery._id} hover>
                  <TableCell>
                    {format(new Date(delivery.deliveryDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{delivery.child?.name}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Restaurant fontSize="small" />
                      {delivery.mealType === "lunch" ? "Lunch" : "Snacks"}
                    </Box>
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
                  <TableCell>{delivery.comment || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
