import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User, LoginUser, InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginUser) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch user session data
  const { isLoading, refetch, data: userData } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false
  });
  
  // Handle user data updates
  useEffect(() => {
    if (userData?.success && userData?.data) {
      console.log("Auth user data:", userData);
      setUser(userData.data);
    } else {
      setUser(null);
    }
  }, [userData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      console.log("Login attempt with:", credentials.username);
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: async (data) => {
      console.log("Login response:", data);
      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Logged in successfully",
        });
        // Save user data from login response
        if (data.data) {
          setUser(data.data);
        }
        // Always refetch to ensure fresh data
        await refetch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Login failed",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive"
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return res.json();
    },
    onSuccess: async (data) => {
      console.log("Register response:", data);
      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Registered successfully",
        });
        // Try to log in automatically after registration
        if (data.data) {
          setUser(data.data);
          await refetch();
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Registration failed",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error("Register error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive"
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return res.json();
    },
    onSuccess: async (data) => {
      console.log("Logout response:", data);
      if (data.success) {
        // Clear user state immediately
        setUser(null);
        // Invalidate all queries to refresh data after logout
        await queryClient.invalidateQueries();
        toast({
          title: "Success",
          description: data.message || "Logged out successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Logout failed",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Logout failed",
        variant: "destructive"
      });
    }
  });

  const login = async (credentials: LoginUser) => {
    return await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: InsertUser) => {
    return await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  // Derive admin and authentication status from user state
  const isAdmin = !!user && user.role === "admin";
  const isAuthenticated = !!user;

  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, isAdmin, user });
  }, [isAuthenticated, isAdmin, user]);

  const value = {
    user,
    isLoading,
    isAdmin,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
