
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
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import { useEffect } from "react";

// Framer Motion for animations
import { AnimatePresence } from "framer-motion";

// Set app title to Buzzer
document.title = "Buzzer - Connect & Share";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Apply light theme only
const LightThemeInitializer = () => {
  useEffect(() => {
    try {
      // Set light theme only
      const root = window.document.documentElement;
      
      // Clear existing theme classes
      root.classList.remove('dark');
      
      // Set light theme class
      root.classList.add('light');
      
      // Clean up any legacy attributes
      document.documentElement.removeAttribute('data-accent-color');
      document.documentElement.removeAttribute('data-text-size');
      
      console.log('Light theme applied');
    } catch (error) {
      console.error("Error initializing light theme:", error);
    }
  }, []);
  
  return null;
};

// Initialize mock data
const MockDataInitializer = () => {
  useEffect(() => {
    // Initialize mock data if not already done
    if (!localStorage.getItem('mockDataInitialized')) {
      console.log('Initializing mock data');
      
      // Store flag to prevent re-initialization
      localStorage.setItem('mockDataInitialized', 'true');
    }
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LightThemeInitializer />
    <MockDataInitializer />
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <div className="w-full min-h-screen">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Homepage route */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/setup" element={<Setup />} />
                  
                  {/* Dashboard routes with section params */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/:section" element={<Dashboard />} />
                  
                  {/* Direct routes for specific sections */}
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:chatId" element={<Messages />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<Admin />} />
                  
                  {/* Other section routes - redirect to dashboard with correct section */}
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
                  
                  {/* Redirect any other paths to 404 */}
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
