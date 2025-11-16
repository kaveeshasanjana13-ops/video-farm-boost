
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import ProductDemoVideos from "./pages/ProductDemoVideos";
import CaseStudies from "./pages/CaseStudies";
import Shorts from "./pages/Shorts";
import Pricing from "./pages/Pricing";
import Career from "./pages/Career";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import YouTubeStrategy from "./pages/YouTubeStrategy";
import YouTubeScriptGenerator from "./pages/YouTubeScriptGenerator";
import ScriptGenerator from "./pages/ScriptGenerator";
import BlogPost from "./pages/BlogPost";
import Blog from "./pages/Blog";
import VideoProduction from "./pages/VideoProduction";
import ContentMachine from "./pages/ContentMachine";
import Schedule from "./pages/Schedule";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/product-demo-videos" element={<ProductDemoVideos />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/career" element={<Career />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/youtube-strategy" element={<YouTubeStrategy />} />
        <Route path="/youtube-script-generator" element={<YouTubeScriptGenerator />} />
        <Route path="/script-generator" element={<ScriptGenerator />} />
          <Route path="/video-production" element={<VideoProduction />} />
          <Route path="/content-machine" element={<ContentMachine />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
