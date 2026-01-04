"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { ArrowBack, Edit, Publish, Unpublished } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../lib/api";
import { format } from "date-fns";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function ViewMenuPage() {
  const router = useRouter();
  const params = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handlePublish = async () => {
    try {
      await api.put(`/menus/${params.id}/publish`);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish menu");
    }
  };

  const handleUnpublish = async () => {
    try {
      await api.put(`/menus/${params.id}/unpublish`);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unpublish menu");
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

  if (error || !menu) {
    return <Alert severity="error">{error || "Menu not found"}</Alert>;
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight="bold">
              Week {menu.weekNumber}, {menu.year}
            </Typography>
            <Chip
              label={menu.isPublished ? "Published" : "Draft"}
              color={menu.isPublished ? "success" : "default"}
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            dates go here
            {/* {format(new Date(menu.weekStartDate), "MMM dd")} -{" "}
            {format(new Date(menu.weekEndDate), "MMM dd, yyyy")} */}
          </Typography>
          {menu.notes && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {menu.notes}
            </Typography>
          )}
        </Box>

        <Box display="flex" gap={2}>
          {!menu.isPublished && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => router.push(`/admin/menus/${params.id}/edit`)}
            >
              Edit
            </Button>
          )}
          {menu.isPublished ? (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Unpublished />}
              onClick={handleUnpublish}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Publish />}
              onClick={handlePublish}
            >
              Publish
            </Button>
          )}
        </Box>
      </Box>

      {/* Menu for Each Day */}
      <Grid container spacing={3}>
        {DAYS.map((day) => (
          <Grid item xs={12} key={day}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ textTransform: "capitalize" }}
                >
                  {day}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={3}>
                  {/* Lunch */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      🍱 Lunch
                    </Typography>
                    {menu.days[day]?.lunch?.length > 0 ? (
                      menu.days[day].lunch.map((item, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No lunch menu
                      </Typography>
                    )}
                  </Grid>

                  {/* Snacks */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      🍪 Snacks
                    </Typography>
                    {menu.days[day]?.snacks?.length > 0 ? (
                      menu.days[day].snacks.map((item, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No snacks menu
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
