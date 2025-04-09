import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_TABS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Star, 
  Users, 
  MessageSquare
} from "lucide-react";

type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar = ({ className }: DashboardSidebarProps) => {
  const [location] = useLocation();
  const { isAdmin } = useAuth();
  
  const currentTab = location.split("/dashboard/")[1] || "overview";

  const getIcon = (id: string) => {
    switch (id) {
      case "overview":
        return <LayoutDashboard className="h-5 w-5" />;
      case "appointments":
        return <Calendar className="h-5 w-5" />;
      case "blog":
        return <FileText className="h-5 w-5" />;
      case "horoscopes":
        return <Star className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "testimonials":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <LayoutDashboard className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn("bg-sidebar border-r border-slate-200 p-4 w-64 h-full", className)}>
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {DASHBOARD_TABS.filter(tab => !tab.adminOnly || isAdmin).map((tab) => (
              <Link 
                key={tab.id} 
                href={`/dashboard/${tab.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-sidebar-foreground",
                  currentTab === tab.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50"
                )}
              >
                {getIcon(tab.id)}
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
