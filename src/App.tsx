// src/App.tsx
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import AuthLoader from "./components/AuthLoader";

// Rutas secundarias: se cargan cuando se visitan (menos JS en la primera carga).
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ConfirmedOrder = lazy(() => import("./pages/ConfirmedOrder"));
const FailedOrder = lazy(() => import("./pages/FailedOrder"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Account = lazy(() => import("./pages/Account"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));

// UI no crítica: banner de cookies + registro del service worker. Se montan
// después de la carga para no competirle ancho de banda / CPU al primer render.
const CookieBanner = lazy(() => import("./components/CookieBanner/CookieBanner"));
const PwaUpdater = lazy(() => import("./components/PwaUpdater"));

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

const DeferredUI = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const arm = () => {
      t = setTimeout(() => setShow(true), 1200);
    };
    if (document.readyState === "complete") {
      arm();
    } else {
      window.addEventListener("load", arm, { once: true });
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", arm);
    };
  }, []);

  if (!show) return null;
  return (
    <Suspense fallback={null}>
      <PwaUpdater />
      <CookieBanner />
    </Suspense>
  );
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
          <Route path="/categoria/:id" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-confirmed" element={<ConfirmedOrder />} />
          <Route path="/order-failed" element={<FailedOrder />} />
          <Route path="/mis-compras" element={<MyOrders />} />
          <Route path="/mi-cuenta" element={<Account />} />
          <Route path="/politica-de-cookies" element={<CookiePolicy />} />
        </Routes>
      </Suspense>
      <DeferredUI />
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
