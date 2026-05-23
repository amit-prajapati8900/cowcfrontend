import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Tabs, Tab, CssBaseline, Alert, CircularProgress } from "@mui/material";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    if (Date.now() < payload.exp * 1000) {
                        navigate("/", { replace: true });
                        return;
                    }
                } catch (err) {
                    localStorage.clear();
                }
            }
            setIsChecking(false);
        };
        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const endpoint = isLogin ? "/login" : "/signup";
            const res = await axios.post(`http://localhost:2323${endpoint}`, formData);

            if (isLogin && res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user || {}));

                setSuccess("Login successful! Redirecting...");
                setTimeout(() => navigate("/", { replace: true }), 1000);
            } else if (!isLogin) {
                setSuccess("Account created successfully! Please login.");
                setIsLogin(true);
                setFormData({ username: "", email: formData.email, password: "" });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isChecking) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
            <CssBaseline />
            <Paper elevation={6} sx={{ p: 4, width: 420, borderRadius: 3 }}>
                <Tabs 
                    value={isLogin ? 0 : 1} 
                    onChange={(e, v) => setIsLogin(v === 0)} 
                    centered 
                    sx={{ mb: 3 }}
                >
                    <Tab label="LOGIN" />
                    <Tab label="SIGN UP" />
                </Tabs>

                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <TextField 
                            fullWidth 
                            label="Username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                    )}
                    <TextField 
                        fullWidth 
                        label="Email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        margin="normal" 
                        required 
                    />
                    <TextField 
                        fullWidth 
                        label="Password" 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        margin="normal" 
                        required 
                    />

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        size="large" 
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 
                            (isLogin ? "LOGIN" : "REGISTER")}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;