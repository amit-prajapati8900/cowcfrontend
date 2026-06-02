import React, { useEffect, useState } from 'react';
import api from '../../axiosConfig';
import {
  Container,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Stack,
  Grid,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import SensorsIcon from '@mui/icons-material/Sensors';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';



// Mock Data for Advanced Charts Integration
const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 550 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 850 },
];

const barData = [
  { name: 'Week 1', amount: 1200 },
  { name: 'Week 2', amount: 2100 },
  { name: 'Week 3', amount: 800 },
  { name: 'Week 4', amount: 1600 },
];

const initialCustomer = {
  name: '',
  address: '',
  contact: '',
  email: '',
  connection: 'Domestic',
  meter: '',
  usage: 0,
};

const initialSensor = {
  meterId: '',
  consumerName: '',
  address: '',
  flowRate: '',
  pressure: '',
  volume: '',
  temperature: '',
  phLevel: '',
  turbidity: '',
  deviceStatus: 'online',
};

const initialComplaint = {
  customerId: '',
  customerName: '',
  contact: '',
  type: '',
  status: 'pending',
  description: '',
};

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal Dialog States
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [sensorDialogOpen, setSensorDialogOpen] = useState(false);
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);

  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeSensor, setActiveSensor] = useState(null);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const [customerForm, setCustomerForm] = useState(initialCustomer);
  const [sensorForm, setSensorForm] = useState(initialSensor);
  const [complaintForm, setComplaintForm] = useState(initialComplaint);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('https://cowcback.onrender.com/show');
      const data = res.data.data || [];
      setCustomers(data.map((item) => ({ ...item, id: item._id })));
    } catch (err) {
      console.error('Customer fetch failed', err);
      setCustomers([]);
    }
  };

  const fetchSensors = async () => {
    try {
      const res = await api.get('https://cowcback.onrender.com/sensor');
      const data = res.data.data || [];
      setSensors(data.map((item) => ({ ...item, id: item._id })));
    } catch (err) {
      console.error('Sensor fetch failed', err);
      setSensors([]);
    }
  };


  const fetchComplaints = async () => {
    try {
      const res = await api.get('https://cowcback.onrender.com/comp');
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setComplaints(data.map((item) => ({ ...item, id: item._id })));
    } catch (err) {
      console.error('Complaint fetch failed', err);
      setComplaints([]);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchCustomers(), fetchSensors(), fetchComplaints()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Dialog Handlers
  const openCustomerDialog = (customer = null) => {
    setActiveCustomer(customer);
    setCustomerForm(customer ? {
      name: customer.name || '',
      address: customer.address || '',
      contact: customer.contact || '',
      email: customer.email || '',
      connection: customer.connection || 'Domestic',
      meter: customer.meter || '',
      usage: customer.usage || 0,
    } : initialCustomer);
    setCustomerDialogOpen(true);
  };

  const openSensorDialog = (sensor = null) => {
    setActiveSensor(sensor);
    setSensorForm(sensor ? {
      meterId: sensor.meterId || '',
      consumerName: sensor.consumerName || '',
      address: sensor.location?.address || '',
      flowRate: sensor.flowRate || '',
      pressure: sensor.pressure || '',
      volume: sensor.volume || '',
      temperature: sensor.temperature || '',
      phLevel: sensor.phLevel || '',
      turbidity: sensor.turbidity || '',
      deviceStatus: sensor.deviceStatus || 'online',
    } : initialSensor);
    setSensorDialogOpen(true);
  };

  const openComplaintDialog = (complaint = null) => {
    setActiveComplaint(complaint);
    setComplaintForm(complaint ? {
      customerId: complaint.customerId || '',
      customerName: complaint.customerName || '',
      contact: complaint.contact || '',
      type: complaint.type || '',
      status: complaint.status || 'pending',
      description: complaint.description || '',
    } : initialComplaint);
    setComplaintDialogOpen(true);
  };

  const handleViewDetails = (item) => {
    setSelectedDetails(item);
    setViewDetailsDialog(true);
  };

  const closeDialogs = () => {
    setSaving(false);
    setCustomerDialogOpen(false);
    setSensorDialogOpen(false);
    setComplaintDialogOpen(false);
    setViewDetailsDialog(false);
    setActiveCustomer(null);
    setActiveSensor(null);
    setActiveComplaint(null);
  };

  // Save Processing
  const handleCustomerSave = async () => {
    if (!customerForm.name || !customerForm.email || !customerForm.connection) {
      return alert('Fill customer name, email and connection type.');
    }
    setSaving(true);
    try {
      if (activeCustomer?._id) {
        await api.put(`https://cowcback.onrender.com/update/${activeCustomer._id}`, customerForm);
      } else {
        await api.post('https://cowcback.onrender.com/new', customerForm);
      }
      await refreshAll();
      closeDialogs();
    } catch (err) {
      console.error(err);
      alert('Unable to save customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleSensorSave = async () => {
    if (!sensorForm.meterId || !sensorForm.flowRate || !sensorForm.pressure || !sensorForm.volume) {
      return alert('Please fill the required sensor fields.');
    }
    setSaving(true);
    try {
      const payload = {
        meterId: sensorForm.meterId,
        consumerName: sensorForm.consumerName,
        flowRate: Number(sensorForm.flowRate),
        pressure: Number(sensorForm.pressure),
        volume: Number(sensorForm.volume),
        temperature: Number(sensorForm.temperature) || undefined,
        phLevel: Number(sensorForm.phLevel) || undefined,
        turbidity: Number(sensorForm.turbidity) || undefined,
        deviceStatus: sensorForm.deviceStatus,
        location: { address: sensorForm.address },
      };
      if (activeSensor?._id) {
        await api.put(`https://cowcback.onrender.com/sensor/update/${activeSensor._id}`, payload);
      } else {
        await api.post('https://cowcback.onrender.com/sensor/new', payload);
      }
      await refreshAll();
      closeDialogs();
    } catch (err) {
      console.error(err);
      alert('Unable to save sensor node.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplaintSave = async () => {
    if (!complaintForm.customerId || !complaintForm.customerName || !complaintForm.type || !complaintForm.description) {
      return alert('Please complete complaint details.');
    }
    setSaving(true);
    try {
      if (activeComplaint?._id) {
        await api.put(`https://cowcback.onrender.com/comp/update/${activeComplaint._id}`, complaintForm);
      } else {
        await api.post('https://cowcback.onrender.com/comp/new', complaintForm);
      }
      await refreshAll();
      closeDialogs();
    } catch (err) {
      console.error(err);
      alert('Unable to save complaint.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (endpoint, id, message) => {
    if (!window.confirm(message)) return;
    try {
      await api.delete(endpoint.replace('{id}', id));
      await refreshAll();
    } catch (err) {
      console.error(err);
      alert('Delete operation failed.');
    }
  };

  const summaryStats = [
    { label: 'Total Customers', value: customers.length || 1245, icon: <PeopleIcon />, color: '#3f51b5' },
    { label: 'Active Sensors', value: sensors.filter((s) => s.deviceStatus === 'online').length || 87, icon: <SensorsIcon />, color: '#4caf50' },
    { label: 'Open Complaints', value: complaints.filter((c) => c.status?.toLowerCase() !== 'resolved').length || 12, icon: <ReportProblemIcon />, color: '#ff9800' },
    { label: 'Grid Alerts Active', value: sensors.filter((s) => s.leakageDetected || s.pressureDropAlert).length || 3, icon: <AssessmentIcon />, color: '#e91e63' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#07111e', py: 4 }}>
      <Container maxWidth="xl">
        
        {/* Modern Header Panel */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '24px', border: '1px solid rgba(148,163,184,0.18)', background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(12,18,34,0.95) 100%)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#e2e8f0', tracking: '-0.5px' }}>
                Water Grid Management Console
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, color: '#94a3b8' }}>
                Real-time telemetry infrastructure, utility distribution logs, and unified CRM pipeline.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button variant="outlined" color="secondary" startIcon={<RefreshIcon />} onClick={refreshAll} sx={{ borderRadius: '12px', fontWeight: 600, borderColor: 'rgba(56,189,248,0.35)', color: '#e2e8f0' }}>
                Refresh Systems
              </Button>
              <Button variant="contained" disableElevation startIcon={<AddCircleIcon />} onClick={() => { setTabValue(1); openCustomerDialog(); }} sx={{ borderRadius: '12px', fontWeight: 600, bgcolor: '#3b82f6' }}>
                Add Customer
              </Button>
              <Button variant="contained" disableElevation color="success" startIcon={<AddCircleIcon />} onClick={() => { setTabValue(2); openSensorDialog(); }} sx={{ borderRadius: '12px', fontWeight: 600, bgcolor: '#10b981' }}>
                Deploy Sensor
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Dashboard Analytics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: '#0f172a', border: '1px solid rgba(148,163,184,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s', '&:hover': { boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.35)' } }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 1, color: '#e2e8f0' }}>{stat.value}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: '16px', bgcolor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tab Selection */}
        <Paper elevation={0} sx={{ mb: 4, borderRadius: '16px', bgcolor: '#0f172a', border: '1px solid rgba(148,163,184,0.18)', p: 0.5 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTab-root': { fontWeight: 600, px: 3, py: 2, borderRadius: '12px' } }}>
            <Tab label="Analytics Dashboard" />
            <Tab label={`Customers Hub (${customers.length})`} />
            <Tab label={`Sensors Network (${sensors.length})`} />
            <Tab label={`Complaints Desk (${complaints.length})`} />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ py: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
            <CircularProgress thickness={4} size={50} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Syncing system arrays...</Typography>
          </Box>
        ) : (
          <>
            {/* TAB 0: ADVANCED CHARTS & ANALYTICS VIEW */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Sensor Fleet Activity (6-Month Scale)</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tick={{ fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" fontSize={12} tick={{ fill: '#cbd5e1' }} />
                        <ChartTooltip wrapperStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.18)', color: '#e2e8f0' }} labelStyle={{ color: '#e2e8f0' }} contentStyle={{ backgroundColor: '#0f172a', color: '#e2e8f0' }} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(148,163,184,0.18)', bgcolor: '#0f172a' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#e2e8f0' }}>Weekly Metered Billing (INR)</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tick={{ fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" fontSize={12} tick={{ fill: '#cbd5e1' }} />
                        <ChartTooltip wrapperStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.18)', color: '#e2e8f0' }} labelStyle={{ color: '#e2e8f0' }} contentStyle={{ backgroundColor: '#0f172a', color: '#e2e8f0' }} />
                        <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Live Sensor Feeds Overview</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Quick diagnostic status logs of live pipeline hardware endpoints.</Typography>
                    <Grid container spacing={2}>
                      {sensors.slice(0, 3).map((sensor) => (
                        <Grid item xs={12} md={4} key={sensor._id}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#e2e8f0' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight={700}>{sensor.meterId}</Typography>
                              <Chip size="small" label={sensor.deviceStatus} color={sensor.deviceStatus === 'online' ? 'success' : 'error'} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">Consumer: {sensor.consumerName || 'N/A'}</Typography>
                            <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                              <Button size="small" variant="text" onClick={() => handleViewDetails(sensor)}>Diagnostics</Button>
                              <Button size="small" variant="text" color="primary" onClick={() => openSensorDialog(sensor)}>Config</Button>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* TAB 1: CUSTOMERS REGISTRY */}
            {tabValue === 1 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" fontWeight={700}>System Consumers Base</Typography>
                  <Button variant="contained" disableElevation startIcon={<AddCircleIcon />} onClick={() => openCustomerDialog()} sx={{ borderRadius: '10px' }}>New Customer Record</Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' } }}>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Email Architecture</TableCell>
                        <TableCell>Connection Framework</TableCell>
                        <TableCell>Assigned Meter ID</TableCell>
                        <TableCell>Gross Usage Metrics</TableCell>
                        <TableCell align="center">Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 600 }}>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell><Chip label={customer.connection} size="small" variant="outlined" color="primary" /></TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{customer.meter || 'Unassigned'}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{customer.usage ?? 0} kL</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Modify Entry"><IconButton size="small" onClick={() => openCustomerDialog(customer)} sx={{ color: '#3b82f6' }}><EditIcon /></IconButton></Tooltip>
                            <Tooltip title="Purge Record"><IconButton size="small" color="error" onClick={() => handleDelete('https://cowcback.onrender.com/delete/{id}', customer._id, 'Permanently delete customer data architecture?')}><DeleteIcon /></IconButton></Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* TAB 2: SENSORS MANAGEMENT NETWORK */}
            {tabValue === 2 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" fontWeight={700}>Telemetry Sensor Node Array</Typography>
                  <Button variant="contained" disableElevation color="success" startIcon={<AddCircleIcon />} onClick={() => openSensorDialog()} sx={{ borderRadius: '10px' }}>Deploy Hardware Edge</Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' } }}>
                        <TableCell>Meter Node Identifier</TableCell>
                        <TableCell>Subscriber Endpoint</TableCell>
                        <TableCell>Telemetry Link Status</TableCell>
                        <TableCell>Flow Capacity (LPM)</TableCell>
                        <TableCell>Barometric Pressure</TableCell>
                        <TableCell>Anomaly Array</TableCell>
                        <TableCell align="center">System Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sensors.map((sensor) => {
                        const anomalyMetrics = [sensor.leakageDetected, sensor.pressureDropAlert, sensor.highConsumptionAlert, sensor.qualityAlert].filter(Boolean).length;
                        return (
                          <TableRow key={sensor._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{sensor.meterId}</TableCell>
                            <TableCell>{sensor.consumerName || 'System Gateway'}</TableCell>
                            <TableCell><Chip label={sensor.deviceStatus || 'online'} size="small" color={sensor.deviceStatus === 'online' ? 'success' : 'error'} variant="flat" /></TableCell>
                            <TableCell>{sensor.flowRate ?? 0} LPM</TableCell>
                            <TableCell>{sensor.pressure ?? 0} Bar</TableCell>
                            <TableCell><Chip label={`${anomalyMetrics} Core Alerts`} size="small" color={anomalyMetrics > 0 ? 'error' : 'success'} /></TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Complete Stream"><IconButton size="small" color="info" onClick={() => handleViewDetails(sensor)}><VisibilityIcon /></IconButton></Tooltip>
                              <Tooltip title="Reconfigure Node"><IconButton size="small" onClick={() => openSensorDialog(sensor)} sx={{ color: '#3b82f6' }}><EditIcon /></IconButton></Tooltip>
                              <Tooltip title="Decommission Node"><IconButton size="small" color="error" onClick={() => handleDelete('https://cowcback.onrender.com/sensor/delete/{id}', sensor._id, 'Decommission hardware telemetry link?')}><DeleteIcon /></IconButton></Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* TAB 3: COMPLAINT DESK STRUCTURE */}
            {tabValue === 3 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" fontWeight={700}>System Grid Ticket Desk</Typography>
                  <Button variant="contained" disableElevation color="warning" startIcon={<AddCircleIcon />} onClick={() => openComplaintDialog()} sx={{ borderRadius: '10px', color: '#fff' }}>Log Grid Incident</Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' } }}>
                        <TableCell>Reporter Account</TableCell>
                        <TableCell>Comms Channel</TableCell>
                        <TableCell>Disruption Class</TableCell>
                        <TableCell>Pipeline Status</TableCell>
                        <TableCell>Operational Narrative</TableCell>
                        <TableCell align="center">Intervention Logs</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complaints.map((complaint) => {
                        const isResolved = String(complaint.status).toLowerCase() === 'resolved';
                        return (
                          <TableRow key={complaint._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 600 }}>{complaint.customerName}</TableCell>
                            <TableCell>{complaint.contact}</TableCell>
                            <TableCell><Chip label={complaint.type || 'General'} size="small" variant="outlined" /></TableCell>
                            <TableCell><Chip label={complaint.status} size="small" color={isResolved ? 'success' : 'warning'} /></TableCell>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{complaint.description}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Update Status"><IconButton size="small" onClick={() => openComplaintDialog(complaint)} sx={{ color: '#3b82f6' }}><EditIcon /></IconButton></Tooltip>
                              <Tooltip title="Erase Log"><IconButton size="small" color="error" onClick={() => handleDelete('https://cowcback.onrender.com/comp/delete/{id}', complaint._id, 'Purge ticket sequence from database analytics?')}><DeleteIcon /></IconButton></Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </>
        )}

        {/* MODAL DIALOGS (CUSTOMERS, SENSORS & COMPLAINTS) */}
        {/* Customer Modal Configuration */}
        <Dialog open={customerDialogOpen} onClose={closeDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
          <DialogTitle fontWeight={700}>{activeCustomer ? 'Modify User Profile Matrix' : 'Initialize Enterprise Consumer Space'}</DialogTitle>
          <DialogContent dividers sx={{ border: 'none' }}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Entity Core Name" name="name" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Electronic Comms Address" name="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Secure Contact Link" name="contact" value={customerForm.contact} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Framework Target" name="connection" value={customerForm.connection} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth>
                  <MenuItem value="Domestic">Domestic Infrastructure</MenuItem>
                  <MenuItem value="Commercial">Industrial Grid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}><TextField label="Physical Grid Localization" name="address" value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Hardware ID Link" name="meter" value={customerForm.meter} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Initial Allocation (Usage)" name="usage" type="number" value={customerForm.usage} onChange={(e) => setCustomerForm({ ...customerForm, [e.target.name]: e.target.value })} fullWidth variant="outlined" /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialogs} color="inherit" sx={{ fontWeight: 600 }}>Abort</Button>
            <Button variant="contained" onClick={handleCustomerSave} disabled={saving} sx={{ borderRadius: '10px', px: 3, fontWeight: 600 }} disableElevation>
              {saving ? 'Processing Storage...' : 'Commit Mutation'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sensor Modal Configuration */}
        <Dialog open={sensorDialogOpen} onClose={closeDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
          <DialogTitle fontWeight={700}>{activeSensor ? 'Reconfigure Grid Node' : 'Deploy Advanced Telemetry Edge'}</DialogTitle>
          <DialogContent dividers sx={{ border: 'none' }}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Meter Node Identifier" name="meterId" value={sensorForm.meterId} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Subscriber Mapping" name="consumerName" value={sensorForm.consumerName} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12}><TextField label="Physical Localization Mapping" name="address" value={sensorForm.address} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Flow Dynamics (LPM)" name="flowRate" type="number" value={sensorForm.flowRate} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Pressure (Bar)" name="pressure" type="number" value={sensorForm.pressure} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Cumulative Volume" name="volume" type="number" value={sensorForm.volume} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Thermal Value (°C)" name="temperature" type="number" value={sensorForm.temperature} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="pH Chemical Balance" name="phLevel" type="number" value={sensorForm.phLevel} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Turbidity Unit Scale" name="turbidity" type="number" value={sensorForm.turbidity} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12}>
                <TextField select label="Node Operational Vector" name="deviceStatus" value={sensorForm.deviceStatus} onChange={(e) => setSensorForm({ ...sensorForm, [e.target.name]: e.target.value })} fullWidth>
                  <MenuItem value="online">Online System Link</MenuItem>
                  <MenuItem value="offline">Isolated Circuit (Offline)</MenuItem>
                  <MenuItem value="maintenance">Diagnostic Hold Sequence</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialogs} color="inherit">Abort</Button>
            <Button variant="contained" color="success" disableElevation onClick={handleSensorSave} disabled={saving} sx={{ borderRadius: '10px', px: 3 }}>
              {saving ? 'Transmitting Arrays...' : 'Sync Deploy'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Complaint Modal Configuration */}
        <Dialog open={complaintDialogOpen} onClose={closeDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
          <DialogTitle fontWeight={700}>{activeComplaint ? 'Escalate Structural Ticket' : 'Intercept Disruption Incident'}</DialogTitle>
          <DialogContent dividers sx={{ border: 'none' }}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Subscriber Identity Token" name="customerId" value={complaintForm.customerId} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Subscriber Registered Name" name="customerName" value={complaintForm.customerName} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Crisis Contact Routing" name="contact" value={complaintForm.contact} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Disruption Vector Class" name="type" value={complaintForm.type} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
              <Grid item xs={12}>
                <TextField select label="Current Resolution State" name="status" value={complaintForm.status} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth>
                  <MenuItem value="pending">Awaiting Engineer Allocation</MenuItem>
                  <MenuItem value="in-progress">Structural Intervention Active</MenuItem>
                  <MenuItem value="resolved">System Matrix Integrity Restored</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}><TextField label="Deep Diagnostics / Breakdown Log" name="description" multiline rows={4} value={complaintForm.description} onChange={(e) => setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value })} fullWidth /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialogs} color="inherit">Cancel</Button>
            <Button variant="contained" color="warning" disableElevation onClick={handleComplaintSave} disabled={saving} sx={{ borderRadius: '10px', px: 3, color: '#fff' }}>
              {saving ? 'Logging Structural Fault...' : 'Broadcast Ticket'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* COMPREHENSIVE HARDWARE INTERACTION OVERVIEW DIAGNOSTIC MODAL */}
        <Dialog open={viewDetailsDialog} onClose={closeDialogs} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
          {selectedDetails && (
            <>
              <DialogTitle fontWeight={800} sx={{ color: '#0f172a' }}>Live System Readout</DialogTitle>
              <DialogContent sx={{ pb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} uppercase="true">Telemetry Signature Identifier</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: 'monospace', mb: 3, color: '#2563eb' }}>{selectedDetails.meterId || 'GLOBAL-SYSTEM-GATEWAY'}</Typography>
                
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Operational Domain</Typography>
                    <Typography variant="body1" fontWeight={700}>{selectedDetails.consumerName || 'System Array Root'}</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bg: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">Flow Dynamics</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{selectedDetails.flowRate ?? 0} LPM</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bg: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">Pipeline Pressure</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{selectedDetails.pressure ?? 0} Bar</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bg: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">Chemical Balance</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{selectedDetails.phLevel ?? 7.0} pH</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bg: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">Fluid Turbidity</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{selectedDetails.turbidity ?? 0} NTU</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Hardware Endpoint Location</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>{selectedDetails.location?.address || selectedDetails.address || 'Global Topology Array'}</Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button variant="contained" fullWidth disableElevation onClick={closeDialogs} sx={{ borderRadius: '12px', py: 1.2, fontWeight: 700, bgcolor: '#0f172a' }}>
                  Release Memory Stack
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

      </Container>
    </Box>
  );
}