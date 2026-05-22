// // src/components/BillingForm.jsx
// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   MenuItem,
// } from "@mui/material";

// const BillingForm = ({ onBillGenerate }) => {
//   const [formData, setFormData] = useState({
//     customerId: "",
//     customerName: "",
//     prevReading: "",
//     currReading: "",
//     units: 0,
//     rate: 10,
//     total: 0,
//     paymentMethod: "",
//     status: "Pending",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const calculateBill = () => {
//     const prev = Number(formData.prevReading);
//     const curr = Number(formData.currReading);
//     const rate = Number(formData.rate);

//     const units = curr - prev;
//     const total = units * rate;

//     return { units, total };
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const { units, total } = calculateBill();

//     if (units < 0) {
//       alert("Current reading cannot be less than previous reading!");
//       return;
//     }

//     const newBill = {
//       id: "BILL-" + Date.now().toString().slice(-6), // unique bill id
//       customerId: formData.customerId,
//       customerName: formData.customerName,
//       prevReading: Number(formData.prevReading),
//       currReading: Number(formData.currReading),
//       units,
//       rate: Number(formData.rate),
//       total,
//       paymentMethod: formData.paymentMethod,
//       status: "Pending",
//       date: new Date().toLocaleDateString("en-IN"),
//     };

//     // Pass the new bill to parent
//     onBillGenerate(newBill);

//     // Reset form after submission
//     setFormData({
//       customerId: "",
//       customerName: "",
//       prevReading: "",
//       currReading: "",
//       units: 0,
//       rate: 10,
//       total: 0,
//       paymentMethod: "",
//       status: "Pending",
//     });

//     alert(`Bill Generated Successfully! ₹${total}`);
//   };

//   return (
//     <div className="mt-5">
//       <Paper elevation={3} style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
//         <Typography variant="h5" gutterBottom>
//           Billing Form
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Customer ID"
//                 name="customerId"
//                 value={formData.customerId}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Customer Name"
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Previous Reading"
//                 name="prevReading"
//                 type="number"
//                 value={formData.prevReading}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Current Reading"
//                 name="currReading"
//                 type="number"
//                 value={formData.currReading}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Rate per Unit (₹)"
//                 name="rate"
//                 type="number"
//                 value={formData.rate}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 select
//                 label="Payment Method"
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               >
//                 <MenuItem value="Cash">Cash</MenuItem>
//                 <MenuItem value="Online">Online</MenuItem>
//                 <MenuItem value="Cheque">Cheque</MenuItem>
//               </TextField>
//             </Grid>

//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" color="primary" fullWidth>
//                 Generate Bill
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </div>
//   );
// };

// export default BillingForm;