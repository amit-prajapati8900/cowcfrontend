import React, { useState, useEffect } from "react";
import Customer from "./Customer";
import Status from "./Status";
// import BillingForm from "../Billing/BillingForm";   // ✅ BillingForm import
import CustomerTable from "./CustomerTable";
import { 
  Box, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Typography,
  Alert,
  Chip
} from "@mui/material";
import axios from "axios";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:2323/show", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.data.map((c) => ({
        ...c,
        id: c._id,
        customerId: c.customerId || c._id,
      }));
      setCustomers(formatted);
    } catch (err) {
      console.error("Error fetching customers:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/Login"; // ✅ redirect
      } else {
        alert("Failed to load customers!");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBills = () => {
    const savedBills = localStorage.getItem("electricityBills");
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  };
  useEffect(() => {
    (async () => {
      await fetchCustomers();
      loadBills();
    })();
  }, []);

  const handleBillGenerate = (newBill) => {
    const updatedBills = [newBill, ...bills];
    setBills(updatedBills);
    localStorage.setItem("electricityBills", JSON.stringify(updatedBills));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Paper sx={{ p: 4 }}>
          <Typography>Loading Customers...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: "center" }}>
          <Typography variant="h3" gutterBottom color="primary">
            ⚡ Electricity Billing System
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Manage Customers & Generate Bills
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ minHeight: 56 }}
          >
            <Tab label="👥 Customers" />
            <Tab label="🧾 Billing" />
            <Tab label="💰 Bills" />
            <Tab label="📈 Table" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Customer
              customers={customers}
              setCustomers={setCustomers}
              liveUpdate={liveUpdate}
              setLiveUpdate={setLiveUpdate}
            />
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Generate New Bill
            </Typography>
            <BillingForm
              customers={customers}
              onBillGenerate={handleBillGenerate}
            />
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Bills History ({bills.length})
            </Typography>
            {bills.length === 0 ? (
              <Alert severity="info">
                No bills generated yet! Create one from <strong>Billing</strong> tab.
              </Alert>
            ) : (
              bills.slice(0, 20).map((bill) => (
                <Paper
                  key={bill.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{bill.id}</Typography>
                    <Typography>
                      {bill.customerName} - {bill.units} units
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {bill.date}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h5" color="success.main">
                      ₹{bill.total.toLocaleString()}
                    </Typography>
                    <Chip label={bill.status} color="success" />
                  </Box>
                </Paper>
              ))
            )}
          </Paper>
        )}

        {tabValue === 3 && (
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ width: "100%", height: 400 }}>
              <CustomerTable customers={customers} />
            </Box>
          </Paper>
        )}

        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Status customers={customers} />
        </Paper>
      </Container>
    </Box>
  );
}
