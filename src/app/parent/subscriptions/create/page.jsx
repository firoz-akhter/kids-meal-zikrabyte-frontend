"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Paper,
  Step,
  Stepper,
  StepLabel,
} from "@mui/material";
import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import api from "@/lib/api";
import api from "../../../../lib/api";

const steps = ["Select Child", "Choose Plan", "Review & Pay"];

const PRICING = {
  weekly: {
    lunch: 500,
    snacks: 300,
    both: 750,
  },
  monthly: {
    lunch: 2000,
    snacks: 1200,
    both: 3000,
  },
};

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    childId: "",
    planType: "monthly",
    mealType: "both",
    paymentMethod: "upi",
  });

  const [priceBreakdown, setPriceBreakdown] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (formData.planType && formData.mealType) {
      calculatePrice();
    }
  }, [formData.planType, formData.mealType]);

  const fetchChildren = async () => {
    try {
      const response = await api.get("/children");
      const activeChildren = response.data.data.children.filter(
        (c) => c.isActive
      );
      setChildren(activeChildren);

      if (activeChildren.length === 1) {
        setFormData((prev) => ({ ...prev, childId: activeChildren[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      const response = await api.post("/subscriptions/calculate-price", {
        planType: formData.planType,
        mealType: formData.mealType,
      });
      setPriceBreakdown(response.data.data);
    } catch (err) {
      console.error("Failed to calculate price:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setError("");
  };

  const handleNext = () => {
    if (activeStep === 0 && !formData.childId) {
      setError("Please select a child");
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    setError("");
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    try {
      await api.post("/subscriptions", formData);
      router.push("/parent/subscriptions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subscription");
      setSubmitting(false);
    }
  };

  const selectedChild = children.find((c) => c._id === formData.childId);

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

  if (children.length === 0) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
        <Alert severity="warning">
          <Typography variant="body1" gutterBottom>
            You need to add a child profile first before creating a
            subscription.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/parent/children/add")}
            sx={{ mt: 2 }}
          >
            Add Child
          </Button>
        </Alert>
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
        Create New Subscription
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Subscribe to daily meal delivery
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {/* Step 1: Select Child */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Select Child
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <FormControl fullWidth>
                    <InputLabel>Choose Child</InputLabel>
                    <Select
                      value={formData.childId}
                      label="Choose Child"
                      onChange={(e) => handleChange("childId", e.target.value)}
                    >
                      {children.map((child) => (
                        <MenuItem key={child._id} value={child._id}>
                          {child.name} - {child.age} years - {child.grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedChild && (
                    <Paper sx={{ p: 2, mt: 3, bgcolor: "grey.50" }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Selected Child Details
                      </Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong> {selectedChild.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>School:</strong>{" "}
                        {selectedChild.deliveryLocation}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Food Preference:</strong>{" "}
                        {selectedChild.foodPreference}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}

              {/* Step 2: Choose Plan */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Choose Your Plan
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                    <FormLabel component="legend">Plan Duration</FormLabel>
                    <RadioGroup
                      value={formData.planType}
                      onChange={(e) => handleChange("planType", e.target.value)}
                    >
                      <FormControlLabel
                        value="weekly"
                        control={<Radio />}
                        label="Weekly Plan (7 days)"
                      />
                      <FormControlLabel
                        value="monthly"
                        control={<Radio />}
                        label="Monthly Plan (30 days) - Best Value!"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Meal Type</FormLabel>
                    <RadioGroup
                      value={formData.mealType}
                      onChange={(e) => handleChange("mealType", e.target.value)}
                    >
                      <FormControlLabel
                        value="lunch"
                        control={<Radio />}
                        label={`Lunch Only - ₹${
                          PRICING[formData.planType].lunch
                        }`}
                      />
                      <FormControlLabel
                        value="snacks"
                        control={<Radio />}
                        label={`Snacks Only - ₹${
                          PRICING[formData.planType].snacks
                        }`}
                      />
                      <FormControlLabel
                        value="both"
                        control={<Radio />}
                        label={`Lunch & Snacks - ₹${
                          PRICING[formData.planType].both
                        } (Recommended)`}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {/* Step 3: Review & Pay */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Review & Payment
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Subscription Summary
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body2">
                        <strong>Child:</strong> {selectedChild?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Plan:</strong>{" "}
                        {formData.planType.charAt(0).toUpperCase() +
                          formData.planType.slice(1)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Meal Type:</strong>{" "}
                        {formData.mealType === "both"
                          ? "Lunch & Snacks"
                          : formData.mealType.charAt(0).toUpperCase() +
                            formData.mealType.slice(1)}
                      </Typography>
                    </Paper>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={formData.paymentMethod}
                      label="Payment Method"
                      onChange={(e) =>
                        handleChange("paymentMethod", e.target.value)
                      }
                    >
                      <MenuItem value="upi">UPI</MenuItem>
                      <MenuItem value="card">Credit/Debit Card</MenuItem>
                      <MenuItem value="netbanking">Net Banking</MenuItem>
                      <MenuItem value="wallet">Wallet</MenuItem>
                    </Select>
                  </FormControl>

                  <Alert severity="info">
                    Payment will be processed upon confirmation. No refunds
                    available after activation.
                  </Alert>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box>
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} />
                        ) : (
                          <ShoppingCart />
                        )
                      }
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      Complete Subscription
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Price Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {priceBreakdown ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Base Price</Typography>
                    <Typography variant="body2">
                      ₹{priceBreakdown.basePrice}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Tax (5%)</Typography>
                    <Typography variant="body2">
                      ₹{priceBreakdown.tax}
                    </Typography>
                  </Box>
                  {priceBreakdown.discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="success.main">
                        Discount
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -₹{priceBreakdown.discount}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ₹{priceBreakdown.totalPrice}
                    </Typography>
                  </Box>

                  <Paper
                    sx={{
                      p: 2,
                      mt: 3,
                      bgcolor: "primary.light",
                      color: "white",
                    }}
                  >
                    <Typography variant="caption" display="block">
                      Duration: {priceBreakdown.breakdown?.duration}
                    </Typography>
                    <Typography variant="caption">
                      {priceBreakdown.breakdown?.description}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select plan to see pricing
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
