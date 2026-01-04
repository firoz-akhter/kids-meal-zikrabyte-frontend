"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { ArrowBack, Save, Publish } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../lib/api";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emptyMenuItem = () => ({
  name: "",
  description: "",
  type: "lunch",
  category: "veg",
  ingredients: [],
  allergens: [],
});

export default function CreateMenuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    weekStartDate: "",
    notes: "",
  });

  // Simplified menu structure - just text areas for each day
  const [menuItems, setMenuItems] = useState({
    monday: { lunch: "", snacks: "" },
    tuesday: { lunch: "", snacks: "" },
    wednesday: { lunch: "", snacks: "" },
    thursday: { lunch: "", snacks: "" },
    friday: { lunch: "", snacks: "" },
    saturday: { lunch: "", snacks: "" },
    sunday: { lunch: "", snacks: "" },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleMenuChange = (day, type, value) => {
    setMenuItems({
      ...menuItems,
      [day]: {
        ...menuItems[day],
        [type]: value,
      },
    });
  };

  const convertToMenuFormat = () => {
    const days = {};

    DAYS.forEach((day) => {
      days[day] = {
        lunch: menuItems[day].lunch
          ? [
              {
                name: menuItems[day].lunch,
                description: "",
                type: "lunch",
                category: "veg",
                ingredients: [],
                allergens: [],
              },
            ]
          : [],
        snacks: menuItems[day].snacks
          ? [
              {
                name: menuItems[day].snacks,
                description: "",
                type: "snacks",
                category: "veg",
                ingredients: [],
                allergens: [],
              },
            ]
          : [],
      };
    });

    return days;
  };

  const handleSubmit = async (publish = false) => {
    setError("");

    if (!formData.weekStartDate) {
      setError("Please select week start date");
      return;
    }

    setLoading(true);

    try {
      const days = convertToMenuFormat();

      const response = await api.post("/menus", {
        weekStartDate: formData.weekStartDate,
        days,
        notes: formData.notes,
      });

      if (publish) {
        await api.put(`/menus/${response.data.data.menu._id}/publish`);
      }

      router.push("/admin/menus");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create menu");
      setLoading(false);
    }
  };

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
        Create Weekly Menu
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Plan meals for the entire week
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Menu Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Week Start Date (Monday)"
                    name="weekStartDate"
                    type="date"
                    value={formData.weekStartDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (optional)"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    placeholder="e.g., Special theme week, holiday menu"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Menu Items for Each Day */}
          {DAYS.map((day) => (
            <Card key={day} sx={{ mb: 2 }}>
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

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="🍱 Lunch Menu"
                      multiline
                      rows={3}
                      value={menuItems[day].lunch}
                      onChange={(e) =>
                        handleMenuChange(day, "lunch", e.target.value)
                      }
                      placeholder="e.g., Rice, Dal, Vegetable Curry, Chapati"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="🍪 Snacks Menu"
                      multiline
                      rows={3}
                      value={menuItems[day].snacks}
                      onChange={(e) =>
                        handleMenuChange(day, "snacks", e.target.value)
                      }
                      placeholder="e.g., Samosa, Fruit, Juice"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          {/* Actions */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Publish />}
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              Save & Publish
            </Button>
          </Box>
        </Grid>

        {/* Sidebar Tips */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                💡 Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Select Monday as the week start date
              </Typography>
              <Typography variant="body2" paragraph>
                • Keep menus simple and clear
              </Typography>
              <Typography variant="body2" paragraph>
                • Consider dietary restrictions
              </Typography>
              <Typography variant="body2" paragraph>
                • Include variety throughout the week
              </Typography>
              <Typography variant="body2">
                • Save as draft to review before publishing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
