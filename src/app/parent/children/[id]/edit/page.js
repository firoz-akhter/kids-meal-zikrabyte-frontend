"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../../lib/api";

export default function EditChildPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    grade: "",
    deliveryLocation: "",
    foodPreference: "veg",
    allergies: [],
  });
  const [allergyInput, setAllergyInput] = useState("");

  useEffect(() => {
    fetchChild();
  }, [params.id]);

  const fetchChild = async () => {
    try {
      const response = await api.get(`/children/${params.id}`);
      const child = response.data.data.child;
      setFormData({
        name: child.name,
        age: child.age,
        grade: child.grade,
        deliveryLocation: child.deliveryLocation,
        foodPreference: child.foodPreference,
        allergies: child.allergies || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load child");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleAddAllergy = () => {
    if (
      allergyInput.trim() &&
      !formData.allergies.includes(allergyInput.trim())
    ) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput("");
    }
  };

  const handleDeleteAllergy = (allergyToDelete) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(
        (allergy) => allergy !== allergyToDelete
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (
      !formData.name ||
      !formData.age ||
      !formData.grade ||
      !formData.deliveryLocation
    ) {
      setError("Please fill in all required fields");
      setSaving(false);
      return;
    }

    try {
      await api.put(`/children/${params.id}`, formData);
      router.push(`/parent/children/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update child");
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
        Edit Child Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Update your child's information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Child's Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 3, max: 18 }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School / Delivery Location"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Preference</InputLabel>
                  <Select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                    label="Food Preference"
                  >
                    <MenuItem value="veg">Vegetarian</MenuItem>
                    <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
                    <MenuItem value="veg-only">Strictly Vegetarian</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Add Allergies (optional)"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAllergy();
                    }
                  }}
                  helperText="Press Enter to add each allergy"
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {formData.allergies.map((allergy, index) => (
                    <Chip
                      key={index}
                      label={allergy}
                      onDelete={() => handleDeleteAllergy(allergy)}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <Save />
                    }
                    disabled={saving}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
