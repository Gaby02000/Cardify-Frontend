// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmedOrder from "./pages/ConfirmedOrder";
import FailedOrder from "./pages/FailedOrder";
import MyOrders from "./pages/MyOrders";
import Navbar from "./components/Navbar/Navbar";
import AuthLoader from "./components/AuthLoader";

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <AuthLoader>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-confirmed" element={<ConfirmedOrder />} />
        <Route path="/order-failed" element={<FailedOrder />} />
        <Route path="/mis-compras" element={<MyOrders />} />
      </Routes>
    </AuthLoader>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
