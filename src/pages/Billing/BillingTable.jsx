import React, { useState, useEffect } from "react";
import { 
  Box, Container, Paper, Tabs, Tab, Typography, TextField, 
  Button, Grid, MenuItem, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import axios from "axios";

// Components
import Customer from "../Customer/Customer";
import Status from "../Customer/Status";
import CustomerTable from "../Customer/CustomerTable";

const useBillingForm = (onBillGenerate) => {
  const initialFormState = {
    customerId: "",
    customerName: "",
    prevReading: "",
    currReading: "",
    units: 0,
    rate: 10,
    paymentMethod: "Cash",
    status: "Pending",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prev = Number(formData.prevReading);
    const curr = Number(formData.currReading);
    const rate = Number(formData.rate);
    const units = curr - prev;

    if (units < 0) {
      alert("Error: Current reading cannot be less than previous reading!");
      return;
    }

    const total = units * rate;
    const newBill = {
      id: "BILL-" + Date.now().toString().slice(-6),
      ...formData,
      prevReading: prev,
      currReading: curr,
      units,
      total,
      date: new Date().toLocaleDateString("en-IN"),
    };

    onBillGenerate(newBill);
    setFormData(initialFormState);
    alert(`Bill Generated Successfully! Total: ₹${total}`);
  };

  return { formData, handleChange, handleSubmit };
};

// ✅ Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function BillingTable() {
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);         
  const [tabValue, setTabValue] = useState(0);    
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // ✅ Token add kiya header mein
        const res = await axios.get("http://localhost:2323/show", getAuthHeader());
        setCustomers(res.data.data.map(c => ({ ...c, id: c._id })));
      } catch (err) { 
        console.error("Error fetching customers:", err);
        if(err.response?.status === 401){
           alert("_session expired! Please login again.");
           localStorage.removeItem("token");
           window.location.href = "/Login";
        }
      } 
      finally { setLoading(false); }
    };
    
    const savedBills = localStorage.getItem('electricityBills');
    if (savedBills) setBills(JSON.parse(savedBills));
    fetchCustomers();
  }, []);

  const handleBillGenerate = (newBill) => {
    const updatedBills = [newBill, ...bills];
    setBills(updatedBills);
    localStorage.setItem('electricityBills', JSON.stringify(updatedBills));
    setTabValue(2);
  };

  // ✅ Print Functionality
  const handlePrint = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill - ${bill.id}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .bill-box { border: 1px solid #ccc; padding: 20px; width: 300px; margin: auto; }
            h2 { text-align: center; color: #1976d2; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="bill-box">
            <h2>Electricity Bill</h2>
            <div class="row"><span>Bill ID:</span> <span>${bill.id}</span></div>
            <div class="row"><span>Date:</span> <span>${bill.date}</span></div>
            <div class="row"><span>Customer:</span> <span>${bill.customerName}</span></div>
            <div class="row"><span>Prev Reading:</span> <span>${bill.prevReading}</span></div>
            <div class="row"><span>Curr Reading:</span> <span>${bill.currReading}</span></div>
            <div class="row"><span>Units Used:</span> <span>${bill.units}</span></div>
            <div class="row"><span>Rate:</span> <span>₹${bill.rate}</span></div>
            <div class="row total"><span>Total Amount:</span> <span>₹${bill.total}</span></div>
            <p style="text-align:center; font-size: 12px; margin-top: 20px;">Thank You!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const billingForm = useBillingForm(handleBillGenerate);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" color="primary" fontWeight="bold">⚡ Billing System</Typography>
        </Paper>

        <Paper sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
            <Tab label="Customers" />
            <Tab label="New Bill" />
            <Tab label="History" />
            <Tab label="Table" />
          </Tabs>
        </Paper>

        {/* New Bill Form Tab */}
        {tabValue === 1 && (
          <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
            <form onSubmit={billingForm.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={6}><TextField label="ID" name="customerId" value={billingForm.formData.customerId} onChange={billingForm.handleChange} fullWidth required /></Grid>
                <Grid item xs={6}><TextField label="Name" name="customerName" value={billingForm.formData.customerName} onChange={billingForm.handleChange} fullWidth required /></Grid>
                <Grid item xs={6}><TextField label="Previous" name="prevReading" type="number" value={billingForm.formData.prevReading} onChange={billingForm.handleChange} fullWidth required /></Grid>
                <Grid item xs={6}><TextField label="Current" name="currReading" type="number" value={billingForm.formData.currReading} onChange={billingForm.handleChange} fullWidth required /></Grid>
                <Grid item xs={12}><Button type="submit" variant="contained" fullWidth>Generate Bill</Button></Grid>
              </Grid>
            </form>
          </Paper>
        )}

        {/* ✅ History Tab as Row/Column Table */}
        {tabValue === 2 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>Bill ID</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Customer</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Units</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Total (₹)</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Date</TableCell>
                  <TableCell sx={{ color: '#fff' }} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No History</TableCell></TableRow>
                ) : (
                  bills.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>{bill.id}</TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell>{bill.units}</TableCell>
                      <TableCell><strong>₹{bill.total}</strong></TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell align="center">
                        <Button 
                          variant="outlined" 
                          startIcon={<PrintIcon />} 
                          onClick={() => handlePrint(bill)}
                          size="small"
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 0 && <Customer customers={customers} />}
        {tabValue === 3 && <CustomerTable customers={customers} />}

        <Box sx={{ mt: 4 }}><Status customers={customers} /></Box>
      </Container>
    </Box>
  );
}