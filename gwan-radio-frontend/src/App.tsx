import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { RadioProvider } from "./presentation/contexts/RadioContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { RadioPlayer } from "./presentation/components/RadioPlayer";
import Home from "./presentation/pages/Home";
import Noticias from "./presentation/pages/Noticias";
import NoticiaDetalhe from "./presentation/pages/NoticiaDetalhe";
import Agenda from "./presentation/pages/Agenda";
import Artistas from "./presentation/pages/Artistas";
import ArtistaDetalhe from "./presentation/pages/ArtistaDetalhe";
import Sobre from "./presentation/pages/Sobre";
import TestChatbot from "./presentation/pages/TestChatbot";
import Login from "./presentation/pages/Login";
import NotFound from "./presentation/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <AuthProvider>
          <RadioProvider>
            <Toaster /> 
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pb-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/noticias" element={<Noticias />} />
                    <Route path="/noticias/:slug" element={<NoticiaDetalhe />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/artistas" element={<Artistas />} />
                    <Route path="/artistas/:slug" element={<ArtistaDetalhe />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/testar-chatbot" element={<TestChatbot />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <RadioPlayer />
              </div>
            </BrowserRouter>
          </RadioProvider>
        </AuthProvider>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
