import React, { useRef, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { 
  Chip, 
  Paper, 
  IconButton, 
  Tooltip, 
  ButtonGroup, 
  Box,
  Typography,
  useTheme,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  Print as PrintIcon,
  FileDownload as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function CustomerTable({ customers }) {
  const [searchId, setSearchId] = useState("");
  const theme = useTheme();

  // Filter customers by ID
  const filteredCustomers = !searchId
    ? customers
    : customers.filter(customer => 
        customer.id.toString().includes(searchId)
      );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "contact", headerName: "Contact", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    { 
      field: "connection", 
      headerName: "Type", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === "Domestic" ? "primary" : "secondary"} 
        />
      )
    },
    { field: "meter", headerName: "Meter", width: 130 },
    { 
      field: "usage", 
      headerName: "Usage (L)", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.toLocaleString()} 
          size="small" 
          color="success" 
          variant="outlined"
        />
      )
    },
  ];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, `customers_${searchId || 'all'}_data.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Customer Data Report ${searchId ? `(ID: ${searchId})` : ''}`, 20, 20);
    
    doc.autoTable({
      head: [['ID', 'Name', 'Address', 'Contact', 'Email', 'Type', 'Meter', 'Usage (L)']],
      body: filteredCustomers.map(row => [
        row.id,
        row.name,
        row.address,
        row.contact,
        row.email,
        row.connection,
        row.meter,
        row.usage.toLocaleString()
      ]),
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 165, 245] }
    });
    
    doc.save(`customers_report_${searchId || 'all'}.pdf`);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchId("");
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        bgcolor: "white",
        '@media print': {
          boxShadow: 'none',
          bgcolor: 'white !important'
        }
      }}
    >
      {/* Header with Search & Action Buttons */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderBottomColor: 'divider',
          '@media print': { display: 'none' }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            Customer Records ({filteredCustomers.length} / {customers.length})
          </Typography>
        </Box>

        {/* Search Box */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchId && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Action Buttons */}
          <ButtonGroup variant="outlined" color="primary">
            <Tooltip title="Print">
              <IconButton onClick={handlePrint} size="small">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Export Excel">
              <IconButton onClick={exportToExcel} size="small">
                <ExcelIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Export PDF">
              <IconButton onClick={exportToPDF} size="small">
                <PdfIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh">
              <IconButton onClick={() => setSearchId("")} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 15, 25]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            [`& .${gridClasses.row}`]: { bgcolor: "white" },
            [`& .${gridClasses.row}:hover`]: { bgcolor: "action.hover" },
            [`& .${gridClasses.columnHeader}`]: {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText
            },
            '& .MuiDataGrid-cell': {
              borderRight: `1px solid ${theme.palette.divider}`
            },
            '@media print': {
              '& .MuiDataGrid-virtualScroller': {
                height: 'auto !important'
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
}