import React, { useState } from "react";
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

  const handleLogin = async () => {
    try {
      const response = await fetch("https://autochefsystem.azurewebsites.net/api/Authentication/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*" },
        body: JSON.stringify({ userName: email, password }),
      });

      const token = await response.text(); // Nếu BE trả về token dưới dạng chuỗi
      console.log("Token received:", token); 

      if (response.ok && token) {
        localStorage.setItem("token", token);
        navigate("/"); 
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại!");
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
