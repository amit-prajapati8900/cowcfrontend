import React from "react";
import { Box } from "@mui/material";
import BillingTable from "./BillingTable";


export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#07111e" }}>
      <BillingTable />
    </Box>
  );
}