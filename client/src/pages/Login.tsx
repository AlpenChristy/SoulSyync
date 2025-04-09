import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  // Get the redirect path from URL query params
  const getRedirectPath = () => {
    const query = new URLSearchParams(location.split("?")[1]);
    return query.get("redirect") || "/";
  };

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      setLocation(redirectPath);
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Log In | SoulSyync</title>
        <meta name="description" content="Log in to your SoulSyync account to book sessions and manage your spiritual journey." />
      </Helmet>

      <div className="min-h-screen py-12 bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-heading font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
