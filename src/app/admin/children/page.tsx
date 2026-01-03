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
} from "@mui/material";
import { Search } from "@mui/icons-material";
// import api from "@/lib/api";
import api from "../../../lib/api";

export default function AdminChildrenPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChildren();
  }, [page, rowsPerPage]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get("/children/admin/all", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
        },
      });
      setChildren(response.data.data.children);
      setTotalCount(response.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load children");
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
        fetchChildren();
      } else {
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          All Children
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all registered children
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name or school..."
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
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Age</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Grade</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Parent</strong>
                    </TableCell>
                    <TableCell>
                      <strong>School</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Food Preference</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Allergies</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {children.map((child) => (
                    <TableRow key={child._id} hover>
                      <TableCell>{child.name}</TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>{child.grade}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {child.parent?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {child.parent?.mobile}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{child.deliveryLocation}</TableCell>
                      <TableCell>
                        <Chip
                          label={child.foodPreference}
                          size="small"
                          color={
                            child.foodPreference === "veg-only"
                              ? "success"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {child.allergies?.length > 0 ? (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {child.allergies.map((allergy, idx) => (
                              <Chip
                                key={idx}
                                label={allergy}
                                size="small"
                                color="error"
                              />
                            ))}
                          </Box>
                        ) : (
                          "-"
                        )}
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
