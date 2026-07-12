import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/features/auth/LoginPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { PageLoader } from "@/components/ui/Spinner";

const CreateEditTestPage = lazy(() =>
  import("@/features/test-form/CreateEditTestPage").then((m) => ({
    default: m.CreateEditTestPage,
  })),
);
const AddQuestionsPage = lazy(() =>
  import("@/features/questions/AddQuestionsPage").then((m) => ({
    default: m.AddQuestionsPage,
  })),
);
const PreviewPublishPage = lazy(() =>
  import("@/features/preview/PreviewPublishPage").then((m) => ({
    default: m.PreviewPublishPage,
  })),
);
const TestTrackingPage = lazy(() =>
  import("@/features/tracking/TestTrackingPage").then((m) => ({
    default: m.TestTrackingPage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageFallback() {
  return <PageLoader />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tests/new" element={<CreateEditTestPage />} />
                <Route path="/tests/:id/edit" element={<CreateEditTestPage />} />
                <Route path="/tests/:id/questions" element={<AddQuestionsPage />} />
                <Route path="/tests/:id/preview" element={<PreviewPublishPage />} />
                <Route path="/tracking" element={<TestTrackingPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
