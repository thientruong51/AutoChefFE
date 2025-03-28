import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Google } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: "", userFullName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
  
    const requestData = { ...user, roleId: 3 };
  
    try {
      const response = await fetch(`${API_URL}/Users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error("Registration failed");
      }
  
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#4BB943",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="white">
          Welcome!
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ p: 4, width: "400px", borderRadius: "12px", textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Register With
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          <IconButton sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: "12px" }}>
            <Google sx={{ color: "#DB4437" }} />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <TextField
          label="UserName"
          placeholder="UserName"
          name="userName"
          fullWidth
          variant="outlined"
          margin="dense"
          value={user.userName}
          onChange={handleChange}
        />
        <TextField
          label="FullName"
          placeholder="FullName"
          name="userFullName"
          fullWidth
          variant="outlined"
          margin="dense"
          value={user.userFullName}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          placeholder="Your password"
          name="password"
          type="password"
          fullWidth
          variant="outlined"
          margin="dense"
          value={user.password}
          onChange={handleChange}
        />

        <FormControlLabel control={<Switch />} label="Remember me" sx={{ mt: 1, color: "gray" }} />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#4BB943",
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderRadius: "10px",
            mt: 2,
            "&:hover": { bgcolor: "#81E879" },
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
          Already have an account?{" "}
          <Button sx={{ color: "#4BB943", fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
