import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const demoUser = { email: "admin@example.com", password: "123456" };
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(demoUser));
    }
  }, []);

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (savedUser && savedUser.email === email && savedUser.password === password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
          padding: 4,
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "350px", textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4BB943", marginBottom: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
            Enter your email and password to sign in
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

          <FormControlLabel control={<Checkbox />} label="Remember me" sx={{ marginTop: 1, alignSelf: "start" }} />

          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#4BB943",
              "&:hover": { backgroundColor: "#81E879" },
              borderRadius: "8px",
            }}
            onClick={handleLogin}
          >
            SIGN IN
          </Button>

          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Don't have an account? <Link component="button" onClick={() => navigate("/register")} sx={{ color: "#4BB943" }}>Sign Up</Link>
          </Typography>
        </Paper>
      </Box>

      {/* Right Side - Image Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#4BB943",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <img src="src/assets/logo.png" alt="Chakra Logo" width={380} height={380} />
        
      </Box>
    </Box>
  );
};

export default Login;