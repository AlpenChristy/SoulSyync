import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Horoscope from "@/pages/Horoscope";
import Booking from "@/pages/Booking";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import EventsPage from "./pages/Event";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/horoscope" component={Horoscope} />
          <Route path="/booking" component={Booking} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard/:tab?" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/events" component={EventsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
