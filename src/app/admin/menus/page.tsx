"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Add,
  Visibility,
  Edit,
  Delete,
  Publish,
  Unpublished,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../lib/api";
import { format } from "date-fns";

export default function AdminMenusPage() {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  console.log("menus,,", menus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await api.get("/menus/admin/all");
      setMenus(response.data.data.menus);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/menus/${id}/publish`);
      fetchMenus();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish menu");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await api.put(`/menus/${id}/unpublish`);
      fetchMenus();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unpublish menu");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;

    try {
      await api.delete(`/menus/${id}`);
      fetchMenus();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete menu");
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
            Menu Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage weekly menus
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/menus/create")}
        >
          Create Menu
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {menus.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No menus created yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/admin/menus/create")}
              sx={{ mt: 2 }}
            >
              Create First Menu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid item xs={12} key={menu._id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          Week {menu.weekNumber}, {menu.year}
                        </Typography>
                        <Chip
                          label={menu.isPublished ? "Published" : "Draft"}
                          color={menu.isPublished ? "success" : "default"}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        dates here,,
                        {/* {format(new Date(menu.weekStartDate), "MMM dd")} -{" "}
                        {format(new Date(menu.weekEndDate), "MMM dd, yyyy")} */}
                      </Typography>

                      {menu.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {menu.notes}
                        </Typography>
                      )}
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/admin/menus/${menu._id}`)}
                        title="View"
                      >
                        <Visibility />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          router.push(`/admin/menus/${menu._id}/edit`)
                        }
                        title="Edit"
                      >
                        <Edit />
                      </IconButton>

                      {menu.isPublished ? (
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleUnpublish(menu._id)}
                          title="Unpublish"
                        >
                          <Unpublished />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handlePublish(menu._id)}
                          title="Publish"
                        >
                          <Publish />
                        </IconButton>
                      )}

                      {!menu.isPublished && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(menu._id)}
                          title="Delete"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
