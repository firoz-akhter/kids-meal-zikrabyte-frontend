"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { ArrowBack, Edit, QrCode2, Download } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../lib/api";

export default function ChildDetailsPage() {
  const router = useRouter();
  const params = useParams();
  // const id = params.id;

  const [child, setChild] = useState(null);
  console.log("child,,", child);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("this is my current page");
    console.log(params);
    fetchChild();
  }, [params.id]);

  const fetchChild = async () => {
    try {
      console.log("before resopnse");
      const response = await api.get(`/children/${params.id}`);
      console.log("response,,", response);
      setChild(response.data.data.child);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load child details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (child?.qrCode) {
      const link = document.createElement("a");
      link.href = child.qrCode;
      link.download = `${child.name}-QRCode.png`;
      link.click();
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

  if (error || !child) {
    return <Alert severity="error">{error || "Child not found"}</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back to Children
      </Button>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {child.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View child profile and QR code
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => router.push(`/parent/children/${params.id}/edit`)}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Child Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {child.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {child.age} years
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Grade
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {child.grade}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    School / Delivery Location
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {child.deliveryLocation}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Food Preference
                  </Typography>
                  <Chip
                    label={child.foodPreference}
                    color={
                      child.foodPreference === "veg-only"
                        ? "success"
                        : "default"
                    }
                  />
                </Box>

                {child.allergies?.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Allergies
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {child.allergies.map((allergy, index) => (
                        <Chip
                          key={index}
                          label={allergy}
                          color="error"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <QrCode2 sx={{ verticalAlign: "middle", mr: 1 }} />
                Delivery QR Code
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {child.qrCode ? (
                <>
                  <Box
                    sx={{
                      display: "inline-block",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <img
                      src={child.qrCode.image}
                      alt={`QR Code for ${child.name}`}
                      style={{ width: 250, height: 250 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    This QR code is used for delivery verification
                  </Typography>

                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadQR}
                  >
                    Download QR Code
                  </Button>
                </>
              ) : (
                <Alert severity="info">QR Code not available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Subscriptions */}
        {child.activeSubscriptions?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🔔 Active Subscriptions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {/* Display active subscriptions here */}
                <Typography variant="body2" color="text.secondary">
                  {child.activeSubscriptions.length} active subscription(s)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
