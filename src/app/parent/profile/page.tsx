"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Person, Lock, Save } from "@mui/icons-material";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../../../context/AuthContext";
// import api from "@/lib/api";
import api from "../../../lib/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.put("/auth/updateProfile", profileData);
      updateUser(response.data.data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <Person sx={{ verticalAlign: "middle", mr: 1 }} />
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Picture */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  fontSize: "2.5rem",
                  mx: "auto",
                  mb: 2,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Update Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Update Profile Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  margin="normal"
                  disabled
                  helperText="Email cannot be changed"
                />

                <TextField
                  fullWidth
                  label="phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 10 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Save />
                  }
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Lock sx={{ verticalAlign: "middle", mr: 1 }} />
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handlePasswordUpdate}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  helperText="Minimum 6 characters"
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Lock />
                  }
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    Parent Account
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
