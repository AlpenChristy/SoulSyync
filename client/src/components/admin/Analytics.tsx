import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  CalendarCheck,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";

interface AnalyticsData {
  userCount: number;
  appointmentStats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    canceled: number;
  };
  blogPostCount: number;
  subscriberCount: number;
  testimonialCount: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

const Analytics = () => {
  const { isAdmin, user } = useAuth();

  // Fetch analytics data for admin
  const { data, isLoading, error } = useQuery<{ success: boolean; data: AnalyticsData }>({
    queryKey: ["/api/analytics"],
    enabled: isAdmin
  });

  const analyticsData = data?.data;

  // If user is not admin, show basic stats
  if (!isAdmin) {
    return (
      <div>
        <h2 className="text-xl font-heading font-semibold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Account</CardTitle>
              <CardDescription>Account information and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.fullName || "Not set"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Useful shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="/dashboard/appointments" 
                  className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50"
                >
                  <CalendarCheck className="h-8 w-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium">My Appointments</span>
                </a>
                <a 
                  href="/profile" 
                  className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50"
                >
                  <Users className="h-8 w-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium">My Profile</span>
                </a>
                <a 
                  href="/booking" 
                  className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50"
                >
                  <CalendarCheck className="h-8 w-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium">Book Session</span>
                </a>
                <a 
                  href="/horoscope" 
                  className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50"
                >
                  <FileText className="h-8 w-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium">Horoscopes</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin analytics
  if (isLoading) {
    return <div className="text-center py-8">Loading analytics data...</div>;
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load analytics data. Please try again later.
      </div>
    );
  }

  // Prepare appointment data for pie chart
  const appointmentData = [
    { name: 'Pending', value: analyticsData.appointmentStats.pending },
    { name: 'Confirmed', value: analyticsData.appointmentStats.confirmed },
    { name: 'Completed', value: analyticsData.appointmentStats.completed },
    { name: 'Canceled', value: analyticsData.appointmentStats.canceled },
  ].filter(item => item.value > 0);

  // Mock data for charts that need historical data
  // In a real app, this would come from the API
  const userGrowthData = [
    { name: 'Jan', users: Math.floor(analyticsData.userCount * 0.2) },
    { name: 'Feb', users: Math.floor(analyticsData.userCount * 0.3) },
    { name: 'Mar', users: Math.floor(analyticsData.userCount * 0.4) },
    { name: 'Apr', users: Math.floor(analyticsData.userCount * 0.55) },
    { name: 'May', users: Math.floor(analyticsData.userCount * 0.7) },
    { name: 'Jun', users: analyticsData.userCount },
  ];

  const subscriberGrowthData = [
    { name: 'Jan', subscribers: Math.floor(analyticsData.subscriberCount * 0.15) },
    { name: 'Feb', subscribers: Math.floor(analyticsData.subscriberCount * 0.25) },
    { name: 'Mar', subscribers: Math.floor(analyticsData.subscriberCount * 0.45) },
    { name: 'Apr', subscribers: Math.floor(analyticsData.subscriberCount * 0.6) },
    { name: 'May', subscribers: Math.floor(analyticsData.subscriberCount * 0.8) },
    { name: 'Jun', subscribers: analyticsData.subscriberCount },
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.appointmentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.appointmentStats.confirmed} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.blogPostCount}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.subscriberCount}</div>
            <p className="text-xs text-muted-foreground">
              Newsletter subscribers
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
              <CardDescription>
                Overview of current appointment statuses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {appointmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-primary-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Pending</p>
                      <p className="text-xs text-gray-500">{analyticsData.appointmentStats.pending} appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-secondary-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Confirmed</p>
                      <p className="text-xs text-gray-500">{analyticsData.appointmentStats.confirmed} appointments</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-accent-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-gray-500">{analyticsData.appointmentStats.completed} appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-[#ec4899] rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Canceled</p>
                      <p className="text-xs text-gray-500">{analyticsData.appointmentStats.canceled} appointments</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                User registration over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>
                Growth in newsletter subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subscriberGrowthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="subscribers" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
