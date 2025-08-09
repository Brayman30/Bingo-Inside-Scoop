"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="btn-outline-brand text-sm font-semibold px-4 py-2"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
