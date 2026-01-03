"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../../lib/api";

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [params.id]);

  const fetchMenu = async () => {
    try {
      const response = await api.get(`/menus/${params.id}`);
      setMenu(response.data.data.menu);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await api.put(`/menus/${params.id}`, {
        days: menu.days,
        notes: menu.notes,
      });
      router.push("/admin/menus");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update menu");
      setSaving(false);
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

  if (!menu) {
    return <Alert severity="error">Menu not found</Alert>;
  }

  if (menu.isPublished) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          This menu is published. You must unpublish it before editing.
        </Alert>
        <Button onClick={() => router.push("/admin/menus")}>
          Back to Menus
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Edit Menu - Week {menu.weekNumber}, {menu.year}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Menu editing feature coming soon. For now, please delete and
            recreate the menu.
          </Alert>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={saving}
            >
              Save Menu
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
