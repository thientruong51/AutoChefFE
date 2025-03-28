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
import { auth, provider, signInWithPopup } from "../firebaseConfig";

// Hàm tự giải mã token JWT và trả về payload dưới dạng JSON
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Gọi API getUserById để lấy thông tin người dùng và roleId
  const fetchUserById = async (token, userId) => {
    try {
      const response = await fetch(`${apiUrl}/Users?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User data fetched:", data);
        // Giả sử dữ liệu trả về là một đối tượng chứa roleId
        if (data && data.roleId !== undefined) {
          localStorage.setItem("roleId", data.roleId);
          console.log("Fetched roleId:", data.roleId);
        } else {
          console.warn("Không tìm thấy roleId trong dữ liệu người dùng");
        }
      } else {
        console.error("Failed to fetch user info. Status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // Sau khi nhận token, lưu token và gọi API getUserById sử dụng userId lấy từ token payload
  const saveTokenAndFetchRole = async (token) => {
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);
    console.log("Decoded token:", decoded);
    if (decoded && (decoded.Id || decoded.userId)) {
      const userId = decoded.Id || decoded.userId;
      console.log("UserId from token:", userId);
      await fetchUserById(token, userId);
    } else {
      console.warn("Không tìm thấy userId trong token payload");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/Authentication/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify({ userName: email, password }),
      });

      const token = await response.text();
      console.log("Token received:", token);

      if (response.ok && token) {
        await saveTokenAndFetchRole(token);
        navigate("/");
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("Google ID Token:", idToken);

      const response = await fetch(`${apiUrl}/Authentication/google-sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify({ idToken }),
      });

      const backendToken = await response.text();
      console.log("Backend Token:", backendToken);

      if (response.ok && backendToken) {
        await saveTokenAndFetchRole(backendToken);
        navigate("/");
      } else {
        setError("Google login failed!");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Google login failed!");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "350px",
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4BB943", marginBottom: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
            Enter your UserName and password to sign in
          </Typography>

          <TextField
            label="UserName"
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

          <Button
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2, borderColor: "#4BB943", color: "#4BB943" }}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Don't have an account?{" "}
            <Link component="button" onClick={() => navigate("/register")} sx={{ color: "#4BB943" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>

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
