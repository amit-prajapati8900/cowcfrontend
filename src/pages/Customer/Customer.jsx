import React, { useState, useEffect } from "react";
import {
  TextField, Button, Select, MenuItem, Box, Grid, Typography,
  Switch, FormControlLabel, Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomerTable from "./CustomerTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Customer({ customers, setCustomers, liveUpdate, setLiveUpdate }) {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    id: "", name: "", address: "", contact: "", email: "",
    connection: "", meter: "", usage: 0
  });

  // ✅ Component load hone par hi login check karo
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login first!");
      navigate("/login"); // Login page par redirect
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    // ✅ Double check - har request se pehle token verify karo
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // ✅ Validation
    if (!form.name || !form.address || !form.connection) {
      alert("Please fill in required fields!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:2323/new",
        {
          name: form.name,
          address: form.address,
          contact: form.contact,
          email: form.email,
          connection: form.connection,
          meter: form.meter,
          usage: parseFloat(form.usage) || 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message);

      setCustomers([...customers, { ...res.data.customer, id: res.data.customer._id }]);

      setForm({ id: "", name: "", address: "", contact: "", email: "", connection: "", meter: "", usage: 0 });
    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 401) {
        alert("Session expired! Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error saving customer");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h2" color="primary">
          Customer Management
        </Typography>
        <FormControlLabel
          control={
            <Switch 
              checked={liveUpdate} 
              onChange={(e) => setLiveUpdate(e.target.checked)}
              color="primary"
            />
          }
          label="Live Updates"
        />
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField fullWidth label="Contact" name="contact" value={form.contact} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Select fullWidth name="connection" value={form.connection} onChange={handleChange}>
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="Domestic">Domestic</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField fullWidth label="Meter No." name="meter" value={form.meter} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4} md={1.5}>
            <TextField 
              fullWidth 
              label="Usage (L)" 
              name="usage" 
              type="number" 
              value={form.usage} 
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={1.5}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleAdd}
              startIcon={<Add />}
              size="large"
              sx={{ height: "100%" }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <CustomerTable customers={customers} />
    </Box>
  );
}