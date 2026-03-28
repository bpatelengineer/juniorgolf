"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Logo } from "@/components/ui/Logo";
import type { Role } from "@prisma/client";

const ROLE_OPTIONS = [
  { value: "PARENT", label: "Parent / Guardian" },
  { value: "JUNIOR", label: "Junior Golfer" },
  { value: "COACH", label: "Coach / Instructor" },
  { value: "ORGANIZER", label: "Event Organizer" },
];

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("PARENT");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const age = calculateAge(dateOfBirth);
  const showParentEmail = age !== null && age < 13;

  const register = trpc.users.register.useMutation({
    onSuccess: () => {
      router.push("/login?registered=1");
    },
    onError: (err) => {
      if (err.message.includes("already registered")) {
        setError("An account with this email already exists.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    },
  });

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    if (!email.includes("@")) errors.email = "Please enter a valid email.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    if (showParentEmail && !parentEmail) errors.parentEmail = "Parent email is required for users under 13.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    register.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
      parentEmail: showParentEmail ? parentEmail.trim() : undefined,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center">
            <Logo size="md" />
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join the DFW junior golf community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              error={fieldErrors.name}
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={fieldErrors.email}
            />

            <Select
              label="I am a"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              options={ROLE_OPTIONS}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={fieldErrors.password}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                error={fieldErrors.confirmPassword}
              />
            </div>

            <Input
              label="Date of birth (optional)"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />

            {showParentEmail && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-3">
                <p className="text-sm text-amber-800 font-medium">
                  Parental consent required for users under 13 (COPPA)
                </p>
                <Input
                  label="Parent / Guardian email"
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  error={fieldErrors.parentEmail}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={register.isPending}
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
