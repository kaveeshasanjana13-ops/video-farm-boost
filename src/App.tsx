import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import RegisterInstituteAdmin from "./pages/RegisterInstituteAdmin";
import RegisterTeacher from "./pages/RegisterTeacher";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterParent from "./pages/RegisterParent";
import RegisterBookHireOwner from "./pages/RegisterBookHireOwner";
import BotPrivacyPolicy from "./pages/BotPrivacyPolicy";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/institute-admin" element={<RegisterInstituteAdmin />} />
          <Route path="/register/teacher" element={<RegisterTeacher />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/parent" element={<RegisterParent />} />
          <Route path="/register/book-hire-owner" element={<RegisterBookHireOwner />} />
          <Route path="/bot-privacy" element={<BotPrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
