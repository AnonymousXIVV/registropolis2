import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

document.title = "Buzzer - Connect & Share";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ThemeInitializer = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInitializer />
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <div className="w-full min-h-screen">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/setup" element={<Setup />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/:section" element={<Dashboard />} />

                  <Route path="/admin" element={<Admin />} />

                  <Route path="/messages" element={<Navigate to="/dashboard/messages" replace />} />
                  <Route path="/messages/:chatId" element={<Navigate to="/dashboard/messages" replace />} />
                  <Route path="/food" element={<Navigate to="/dashboard/food" replace />} />
                  <Route path="/taxi" element={<Navigate to="/dashboard/taxi" replace />} />
                  <Route path="/marketplace" element={<Navigate to="/dashboard/marketplace" replace />} />
                  <Route path="/business" element={<Navigate to="/dashboard/business" replace />} />
                  <Route path="/jobs" element={<Navigate to="/dashboard/jobs" replace />} />
                  <Route path="/services" element={<Navigate to="/dashboard/services" replace />} />
                  <Route path="/real-estate" element={<Navigate to="/dashboard/real-estate" replace />} />
                  <Route path="/transport" element={<Navigate to="/dashboard/transport" replace />} />
                  <Route path="/events" element={<Navigate to="/dashboard/events" replace />} />
                  <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </TooltipProvider>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
