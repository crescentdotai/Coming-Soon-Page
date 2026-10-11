import { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon.jsx";
import Legal from "./pages/Legal.jsx";

// Short loader between route changes, matching the spinner beat in the reference
function RouteLoader({ children }) {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(true);

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(t);
  }, [pathname]);

  return ready ? children : <div className="loader" role="status" aria-label="Loading" />;
}

export default function App() {
  return (
    <Suspense fallback={<div className="loader" />}>
      <RouteLoader>
        <Routes>
          <Route path="/" element={<ComingSoon />} />
          <Route path="/privacy" element={<Legal page="privacy" />} />
          <Route path="/accessibility" element={<Legal page="accessibility" />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </RouteLoader>
    </Suspense>
  );
}
