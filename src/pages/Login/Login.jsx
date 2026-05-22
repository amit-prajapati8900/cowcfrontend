import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Tabs, Tab, CssBaseline, Alert } from "@mui/material";

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

    // Check existing session
    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    if (Date.now() < payload.exp * 1000) {
                        navigate("/", { replace: true });
                        return;
                    }
                }
            } catch (err) {
                localStorage.removeItem("token");
            }
            setIsChecking(false);
        };
        setTimeout(checkAuth, 100);
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
            let res;
            
            if (isLogin) {
                res = await axios.post("http://localhost:2323/login", {
                    email: formData.email,
                    password: formData.password
                });
            } else {
                res = await axios.post("http://localhost:2323/signup", {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });
            }

            if (isLogin) {
                const { token, user, login } = res.data;
                
                if (login === "success" && token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    setSuccess("Login successful!");
                    setTimeout(() => navigate("/", { replace: true }), 500);
                } else {
                    setError("Invalid response");
                }
            } else {
                setSuccess("Account created! Please login.");
                setIsLogin(true);
                setFormData(prev => ({ ...prev, password: "" }));
            }

        } catch (err) {
            const msg = err.response?.data?.message || "Error";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (isChecking) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>Loading...</Box>;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
            <CssBaseline />
            <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={isLogin ? 0 : 1} onChange={(e, v) => setIsLogin(v === 0)} centered fullWidth>
                        <Tab label="LOGIN" />
                        <Tab label="SIGN UP" />
                    </Tabs>
                </Box>

                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: isLogin ? 'none' : 'block' }}>
                        <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="normal" required={!isLogin} />
                    </Box>
                    <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required />
                    <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
                        {loading ? "Please wait..." : (isLogin ? "LOGIN" : "REGISTER")}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;