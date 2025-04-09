import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { DASHBOARD_TABS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Analytics from "@/components/admin/Analytics";
import AppointmentsList from "@/components/admin/AppointmentsList";
import BlogEditor from "@/components/admin/BlogEditor";
import HoroscopeEditor from "@/components/admin/HoroscopeEditor";
import UsersList from "@/components/admin/UsersList";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

const Dashboard = () => {
  const { tab } = useParams();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [, setLocation] = useLocation();

  const currentTab = tab || "overview";

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  // If tab requires admin access but user is not admin, redirect to overview
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      const tabInfo = DASHBOARD_TABS.find(t => t.id === currentTab);
      if (tabInfo?.adminOnly) {
        setLocation("/dashboard/overview");
      }
    }
  }, [isAuthenticated, isAdmin, currentTab, setLocation]);

  if (!isAuthenticated) {
    return null;
  }
  
  console.log("Dashboard user:", user, "isAdmin:", isAdmin);

  return (
    <>
      <Helmet>
        <title>Dashboard | SoulSyync</title>
        <meta name="description" content="Manage your spiritual wellness journey with SoulSyync's dashboard." />
      </Helmet>

      <div className="flex min-h-screen bg-gray-100">
        <DashboardSidebar className="hidden md:block" />

        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back, {user?.fullName || user?.username}!
            </p>
          </div>

          <div className="md:hidden mb-6">
            <Tabs value={currentTab} onValueChange={(value) => setLocation(`/dashboard/${value}`)}>
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              {isAdmin && (
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="horoscopes">Horoscopes</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
              )}
              {isAdmin && (
                <TabsList className="grid grid-cols-1 w-full">
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                </TabsList>
              )}
            </Tabs>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {currentTab === "overview" && (
              <Analytics />
            )}

            {currentTab === "appointments" && (
              <AppointmentsList />
            )}

            {isAdmin && currentTab === "blog" && (
              <BlogEditor />
            )}

            {isAdmin && currentTab === "horoscopes" && (
              <HoroscopeEditor />
            )}

            {isAdmin && currentTab === "users" && (
              <UsersList />
            )}

            {isAdmin && currentTab === "testimonials" && (
              <TestimonialsManager />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
