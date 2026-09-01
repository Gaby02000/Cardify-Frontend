// src/App.tsx
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import AuthLoader from "./components/AuthLoader";
import CookieBanner from "./components/CookieBanner/CookieBanner";

// Rutas secundarias: se cargan cuando se visitan (menos JS en la primera carga).
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ConfirmedOrder = lazy(() => import("./pages/ConfirmedOrder"));
const FailedOrder = lazy(() => import("./pages/FailedOrder"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Account = lazy(() => import("./pages/Account"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

const RouteFallback = () => (
  <div className="route-fallback">
    <span className="spinner" />
  </div>
);

// Al cambiar de ruta (sin hash), volvemos arriba de todo.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <AuthLoader>
      <ScrollToTop />
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-confirmed" element={<ConfirmedOrder />} />
          <Route path="/order-failed" element={<FailedOrder />} />
          <Route path="/mis-compras" element={<MyOrders />} />
          <Route path="/mi-cuenta" element={<Account />} />
          <Route path="/politica-de-cookies" element={<CookiePolicy />} />
        </Routes>
      </Suspense>
      <CookieBanner />
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
