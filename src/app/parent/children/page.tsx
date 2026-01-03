"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, QrCode2 } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../lib/api";

export default function ChildrenListPage() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  console.log("children,,", children);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get("/children");
      setChildren(response.data.data.children);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this child profile?")) {
      return;
    }

    try {
      await api.delete(`/children/delete/${id}`);
      setChildren(children.filter((child) => child._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete child");
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
            My Children
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your children's profiles and subscriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/parent/children/add")}
        >
          Add Child
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {children.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No children profiles yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Add your first child to get started with meal subscriptions
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/parent/children/add")}
            >
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {children.map((child) => (
            <Grid item xs={12} md={6} lg={4} key={child._id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {child.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {child.age} years old
                      </Typography>
                    </Box>
                    <Chip
                      label={child.foodPreference}
                      size="small"
                      color={
                        child.foodPreference === "veg-only"
                          ? "success"
                          : "default"
                      }
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Grade: <strong>{child.grade}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      School: <strong>{child.deliveryLocation}</strong>
                    </Typography>
                    {child.allergies?.length > 0 && (
                      <Typography variant="body2" color="error.main">
                        Allergies: {child.allergies.join(", ")}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(`/parent/children/${child._id}`)
                      }
                      title="View QR Code"
                    >
                      <QrCode2 />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        router.push(`/parent/children/${child._id}/edit`)
                      }
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(child._id)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => router.push(`/parent/children/${child._id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
