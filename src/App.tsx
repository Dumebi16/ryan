import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import SBALoan from "./pages/SBALoan";
import BusinessAcquisition from "./pages/BusinessAcquisition";
import StrategicFinancialGuidance from "./pages/StrategicFinancialGuidance";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import ResourcePost from "./pages/ResourcePost";
import Admin from "./pages/Admin";

import { HelmetProvider } from "react-helmet-async";

// ---------------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
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
    </BrowserRouter>
  </HelmetProvider>
  );
}
