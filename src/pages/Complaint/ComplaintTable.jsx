import React, { useEffect, useState } from "react";
import api from '../../axiosConfig';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  TableContainer,
  Chip,
  Box
} from "@mui/material";

const ComplaintTable = ({ refreshTrigger, newlyAddedComplaints }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('https://cowcback.onrender.com/comp');
      const data = Array.isArray(res.data) ? res.data : res.data.data || res.data || [];
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and trigger dependencies
  useEffect(() => {
    fetchComplaints();
  }, [refreshTrigger]);

  // Sync state if form inserts item onto live local page scope arrays
  useEffect(() => {
    if (newlyAddedComplaints && newlyAddedComplaints.length > 0) {
      setComplaints(newlyAddedComplaints);
    }
  }, [newlyAddedComplaints]);

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "20px", border: "1px solid rgba(148,163,184,0.18)", overflow: "hidden", bgcolor: "#0f172a" }}>
      <Box sx={{ p: 3, bgcolor: "#0b1524", borderBottom: "1px solid rgba(148,163,184,0.18)" }}>
        <Typography variant="h6" fontWeight="700" color="#e2e8f0">
          Registered Complaints ({complaints.length})
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : complaints.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 8, fontStyle: "italic" }}>
          No active client grievances registered yet.
        </Typography>
      ) : (
        <Table>
          <TableHead sx={{ bgcolor: '#243b55' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }}>Customer ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }}>Customer Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }}>Issue Category</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }}>Ticket Description</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }} align="center">Status</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: "700" }}>Logged Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((c) => (
              <TableRow key={c._id || Math.random()} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ fontWeight: "600" }}>{c.customerId}</TableCell>
                <TableCell>{c.customerName}</TableCell>
                <TableCell>
                  <Chip 
                    label={c.type} 
                    variant="outlined" 
                    size="small" 
                    sx={{ fontWeight: "500", borderColor: "rgba(0,0,0,0.12)" }} 
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 320, whiteSpace: "normal", color: "text.secondary", fontSize: "0.9rem" }}>
                  {c.description}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={c.status ? c.status.toUpperCase() : "PENDING"}
                    size="small"
                    sx={{
                      fontWeight: "700",
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      px: 0.5,
                      backgroundColor: c.status?.toLowerCase() === "pending" ? "rgba(255, 152, 0, 0.15)" : "rgba(76, 175, 80, 0.15)",
                      color: c.status?.toLowerCase() === "pending" ? "#b78103" : "#2e7d32",
                      border: "1px solid",
                      borderColor: c.status?.toLowerCase() === "pending" ? "rgba(255, 152, 0, 0.3)" : "rgba(76, 175, 80, 0.3)"
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default ComplaintTable;