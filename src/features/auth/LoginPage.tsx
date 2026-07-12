import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "@/api/auth";
import { extractErrorMessage } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { Logo } from "@/components/Logo";
import { LoginIllustration } from "@/components/LoginIllustration";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues =  z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await login(values);
      setAuth(result.token, result.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = extractErrorMessage(error, "Invalid User ID or password");
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <div className="hidden w-1/2 flex-col items-center justify-center p-10 lg:flex">
        <LoginIllustration />
      </div>

      <div className="flex w-full items-center justify-center p-2 lg:w-1/2">
        <div className="w-full h-full max-w-full rounded-2xl border border-[#60a5fa] bg-white p-6 shadow-sm sm:p-10">
          <Logo className="mb-8" />
          <h1 className="text-xl font-semibold text-slate-800">Login</h1>
          <p className="mt-1 text-sm text-slate-800">
            Use your company provided Login credentials
          </p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Field label="User ID" htmlFor="userId" required error={errors.userId?.message}>
              <Input
                id="userId"
                placeholder="Enter User ID"
                autoComplete="username"
                invalid={!!errors.userId}
                {...register("userId")}
              />
            </Field>

            <Field label="Password" htmlFor="password" required error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                invalid={!!errors.password}
                {...register("password")}
              />
            </Field>

            {formError && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {formError}
              </p>
            )}

            <button
              type="button"
              className="-mt-2 self-start text-sm text-primary-500 hover:underline"
            >
              Forgot password?
            </button>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Spinner className="text-white" />}
              {submitting ? "Logging in…" : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
