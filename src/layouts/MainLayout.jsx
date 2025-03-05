import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <div style={{ width: "250px", flexShrink: 0 }}>
      <Sidebar />
    </div>
    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "20px", flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  </div>
);

export default MainLayout;
