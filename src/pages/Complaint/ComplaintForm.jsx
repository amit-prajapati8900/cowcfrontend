import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

const ComplaintForm = ({ onComplaintRegistered }) => {
  const [complaintData, setComplaintData] = useState({
    customerId: "",
    customerName: "",
    contact: "",
    type: "",
    description: "",
    status: "pending",   // backend enum ke hisaab se lowercase
  });

  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaintData.type) {
      setFormError("Please select a Complaint Type");
      return;
    }
    if (!complaintData.description.trim()) {
      setFormError("Please enter description");
      return;
    }

    try {
      const response = await fetch("http://localhost:2323/comp/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...complaintData,
          customerId: Number(complaintData.customerId),
          contact: Number(complaintData.contact),
        }),
      });

      if (!response.ok) throw new Error("Failed to save complaint");

      const savedComplaint = await response.json();
      onComplaintRegistered(savedComplaint);

      setSuccessMsg("Complaint registered successfully!");

      // Reset form
      setComplaintData({
        customerId: "",
        customerName: "",
        contact: "",
        type: "",
        description: "",
        status: "pending",
      });
    } catch (err) {
      console.error(err);
      setFormError("Error saving complaint. Please try again.");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        maxWidth: 750,
        margin: "40px auto",
        borderRadius: 4,
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        fontWeight="bold"
        color="primary"
      >
        Register New Complaint
      </Typography>

      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer ID"
              name="customerId"
              value={complaintData.customerId}
              onChange={handleChange}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={complaintData.customerName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              name="contact"
              value={complaintData.contact}
              onChange={handleChange}
              fullWidth
              required
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Complaint Type *"
              name="type"
              value={complaintData.type}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                -- Select Complaint Type --
              </MenuItem>
              <MenuItem value="Billing">Billing Issue</MenuItem>
              <MenuItem value="Service Related">Service Related</MenuItem>
              <MenuItem value="Meter">Meter Problem</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={complaintData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={5}
              required
              placeholder="Describe your complaint in detail..."
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 3, boxShadow: 3 }}
            >
              Register Complaint
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ComplaintForm;
