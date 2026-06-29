import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import { PageTracker } from "./hooks/usePageTracking";
import { HelmetProvider } from "react-helmet-async";

const About = lazy(() => import("./pages/About"));
const SBALoan = lazy(() => import("./pages/SBALoan"));
const BusinessAcquisition = lazy(() => import("./pages/BusinessAcquisition"));
const StrategicFinancialGuidance = lazy(() => import("./pages/StrategicFinancialGuidance"));
const Contact = lazy(() => import("./pages/Contact"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourcePost = lazy(() => import("./pages/ResourcePost"));
const Admin = lazy(() => import("./pages/Admin"));

// ---------------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <PageTracker />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="sba-loans" element={<SBALoan />} />
              <Route path="business-acquisition" element={<BusinessAcquisition />} />
              <Route path="strategic-financial-guidance" element={<StrategicFinancialGuidance />} />
              <Route path="contact" element={<Contact />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:slug" element={<ResourcePost />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
