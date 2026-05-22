import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Bootstrap
import {
  Container, Row, Col, Card, Button, Badge, Spinner, ProgressBar,
  Modal, Form, InputGroup
} from "react-bootstrap";

// Icons
import {
  IoAlertCircle as AlertIcon,
  IoPulse as SensorIcon,
  IoWifi as OnlineIcon,
  IoWater as LiveIcon,
  IoLocationOutline as LocationIcon,
  IoPersonOutline as UserIcon
} from "react-icons/io5";

import {
  MdShowChart,
  MdPieChart,
  MdTrendingUp,
  MdStorage as Database,
  MdAddCircle,
  MdRefresh,
  MdWaterDrop as Droplet,
  MdThermostat,
  MdSpeed,
  MdScience,
  MdSettingsInputComponent,
  MdOutlineOpacity
} from "react-icons/md";

// Chart.js
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip as ChartTooltip, Legend
} from "chart.js";

import StatsCard from "./LiveSensors";
import { SensorAlerts } from './SensorAlerts';
import './SensorDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, ChartTooltip, Legend);

// Component: Premium Sensor Card
const SensorCard = ({ sensor }) => (
  <Card className="sensor-item-card mb-4 shadow-sm border-0 animate-card">
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <div className="status-indicator me-2 bg-success"></div>
          <h6 className="mb-0 fw-bold text-dark">{sensor.meterId}</h6>
        </div>
        <Badge pill className={sensor.deviceStatus === 'online' ? 'bg-soft-success text-success' : 'bg-soft-secondary text-secondary'}>
          {sensor.deviceStatus?.toUpperCase()}
        </Badge>
      </div>
      
      <p className="text-muted small mb-3">
        <UserIcon className="me-1"/> {sensor.consumerName || 'Unnamed Consumer'}
      </p>

      <Row className="g-3">
        <Col xs={6}>
          <div className="metric-box">
            <MdSpeed className="text-primary"/>
            <div>
              <span className="d-block fw-bold">{sensor.flowRate}</span>
              <small>LPM</small>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-box">
            <MdTrendingUp className="text-info"/>
            <div>
              <span className="d-block fw-bold">{sensor.pressure}</span>
              <small>PSI</small>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-box">
            <MdScience className="text-warning"/>
            <div>
              <span className="d-block fw-bold">{sensor.phLevel}</span>
              <small>pH</small>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-box">
            <MdOutlineOpacity className="text-secondary"/>
            <div>
              <span className="d-block fw-bold">{sensor.turbidity || 0}</span>
              <small>NTU</small>
            </div>
          </div>
        </Col>
      </Row>
      
      {sensor.leakageDetected && (
        <Badge bg="danger" className="w-100 mt-2 py-2">LEAKAGE DETECTED</Badge>
      )}
    </Card.Body>
  </Card>
);

const SensorDashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    meterId: `MTR-${Math.floor(1000 + Math.random() * 9000)}`,
    flowRate: '',
    pressure: '',
    volume: '',
    phLevel: '7.0',
    temperature: '25.0',
    turbidity: '1.0',
    consumerName: '',
    address: '',
    deviceStatus: 'online'
  });

  const API_BASE = 'http://localhost:2323';

  const fetchSensors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/sensor`);
      const data = res.data.data || res.data || [];
      setSensors(data);
      
      const total = data.length;
      const online = data.filter(s => s.deviceStatus === 'online').length;
      const alertList = data.filter(s => s.leakageDetected || s.pressureDropAlert || s.highConsumptionAlert || s.qualityAlert);
      
      setStats({
        totalSensors: total,
        onlineSensors: online,
        activeAlerts: alertList.length,
        avgFlow: data.reduce((sum, s) => sum + (Number(s.flowRate) || 0), 0) / Math.max(total, 1)
      });
      setAlerts(alertList);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 30000);
    return () => clearInterval(interval);
  }, [fetchSensors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      flowRate: parseFloat(formData.flowRate),
      pressure: parseFloat(formData.pressure),
      volume: parseFloat(formData.volume),
      phLevel: parseFloat(formData.phLevel),
      temperature: parseFloat(formData.temperature),
      turbidity: parseFloat(formData.turbidity),
      location: { address: formData.address }
    };

    try {
      await axios.post(`${API_BASE}/sensor/new`, payload);
      setShowForm(false);
      fetchSensors();
      alert("IoT Node Initialized Successfully!");
    } catch (err) {
      alert("Deployment Failed: Check backend connection.");
    }
  };

  return (
    <div className="sensor-dashboard-main">
      <div className="top-nav-glass py-3 mb-4 shadow-sm">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="mb-0 fw-bold d-flex align-items-center">
                <div className="icon-pulse me-2"><LiveIcon/></div>
                AquaPulse IoT Central
              </h4>
            </Col>
            <Col md={6} className="text-md-end">
              <Button variant="light" className="me-2 rounded-pill shadow-sm" onClick={fetchSensors}>
                <MdRefresh/> Sync
              </Button>
              <Button variant="primary" className="rounded-pill px-4 shadow btn-gradient" onClick={() => setShowForm(true)}>
                <MdAddCircle className="me-1"/> New Node
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="mb-4 g-3">
          <Col md={3}><StatsCard title="Nodes" value={stats.totalSensors || 0} icon={<SensorIcon/>} color="blue"/></Col>
          <Col md={3}><StatsCard title="Online" value={stats.onlineSensors || 0} icon={<OnlineIcon/>} color="green"/></Col>
          <Col md={3}><StatsCard title="Critical" value={stats.activeAlerts || 0} icon={<AlertIcon/>} color="red" isAlert/></Col>
          <Col md={3}><StatsCard title="Total Flow" value={`${(stats.avgFlow || 0).toFixed(1)} LPM`} icon={<Droplet/>} color="purple"/></Col>
        </Row>

        <Row>
          <Col lg={8}>
            <div className="section-title d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-secondary">LIVE NODES</h5>
              <Badge bg="light" text="dark">{sensors.length} Active</Badge>
            </div>
            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
              <Row>
                {sensors.map((s, i) => (
                  <Col md={6} xl={4} key={i}><SensorCard sensor={s}/></Col>
                ))}
              </Row>
            )}
          </Col>
          <Col lg={4}>
            <SensorAlerts alerts={alerts} />
            <Card className="mt-4 border-0 shadow-sm welcome-card bg-dark text-white">
              <Card.Body>
                <h6 className="fw-bold"><MdTrendingUp className="me-2"/>System Health</h6>
                <ProgressBar variant="info" now={92} label="92%" className="my-3 custom-progress" />
                <p className="small opacity-75 mb-0">System is performing optimally across all zones.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal with Full Schema Options */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered className="premium-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Node Configuration</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small fw-bold">Customer Name</Form.Label>
                <Form.Control name="consumerName" value={formData.consumerName} onChange={handleInputChange} placeholder="John Doe" required />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold">Meter Identifier</Form.Label>
                <Form.Control name="meterId" value={formData.meterId} onChange={handleInputChange} required />
              </Col>
              <Col md={12}>
                <Form.Label className="small fw-bold">Installation Address</Form.Label>
                <Form.Control name="address" value={formData.address} onChange={handleInputChange} placeholder="Street, City, Zone" />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Flow (LPM)</Form.Label>
                <Form.Control type="number" step="0.1" name="flowRate" value={formData.flowRate} onChange={handleInputChange} required />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Pressure (PSI)</Form.Label>
                <Form.Control type="number" step="0.1" name="pressure" value={formData.pressure} onChange={handleInputChange} required />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Volume (L)</Form.Label>
                <Form.Control type="number" name="volume" value={formData.volume} onChange={handleInputChange} required />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Quality (pH)</Form.Label>
                <Form.Control type="number" step="0.1" name="phLevel" value={formData.phLevel} onChange={handleInputChange} />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Turbidity (NTU)</Form.Label>
                <Form.Control type="number" step="0.1" name="turbidity" value={formData.turbidity} onChange={handleInputChange} />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold">Temp (°C)</Form.Label>
                <Form.Control type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleInputChange} />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="px-5 shadow btn-gradient">Initialize Node</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default SensorDashboard;