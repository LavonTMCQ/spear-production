"use client";

import { memo } from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

function LoadingComponent({
  size = "md",
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} rounded-full border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin`}
      ></div>
      {message && <p className="mt-4 text-slate-500">{message}</p>}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const Loading = memo(LoadingComponent);
