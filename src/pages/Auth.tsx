import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 mb-8">
          <Shield className="w-12 h-12 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Healthcare Assistant</h1>
          <p className="text-muted-foreground text-center">
            Sign in to access your personal healthcare assistant
          </p>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            This is a demo application. Please do not enter real medical information.
          </AlertDescription>
        </Alert>

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(37, 99, 235)',
                  brandAccent: 'rgb(29, 78, 216)',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;