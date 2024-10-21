import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import AppRoutes from "@/approutes";
import { useEffect } from "react";
import { useAuthProvider } from "@/store";
import { LazySpinner } from "@/components";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthProvider();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LazySpinner />;

  return (
    <>
      <HelmetProvider>
        <Toaster richColors />
        <AppRoutes />
      </HelmetProvider>
    </>
  );
}

export default App;
