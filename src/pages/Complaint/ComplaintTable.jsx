import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from "@mui/material";

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:2323/comp");
        setComplaints(res.data); // backend se array aayega
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <Paper sx={{ marginTop: 4, padding: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Registered Complaints
      </Typography>

      {loading ? (
        <Typography align="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Typography>
      ) : complaints.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No complaints registered yet.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Complaint ID</strong></TableCell>
              <TableCell><strong>Customer Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.customerId}</TableCell>
                <TableCell>{c.customerName}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell style={{ maxWidth: 300, whiteSpace: "normal" }}>
                  {c.description}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      backgroundColor:
                        c.status === "pending" ? "#ff9800" : "#4caf50",
                      color: "white",
                      fontSize: "0.85rem",
                    }}
                  >
                    {c.status}
                  </span>
                </TableCell>
                <TableCell>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default ComplaintTable;
