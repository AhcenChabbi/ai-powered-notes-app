"use client";
import { Brain, Plus } from "lucide-react";
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Floating New Note Button Skeleton */}
      <div className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center justify-center animate-pulse">
        <Plus className="w-6 h-6 text-white animate-bounce" />
      </div>

      {/* Loading overlay with progress */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-spin">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground animate-pulse">
              Preparing your notes and AI features...
            </p>
          </div>
          <div className="w-48 mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
