"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/tasks" className="text-xl font-bold text-gray-900">
                Task Manager
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link href="/tasks" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Tasks
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button onClick={logout} className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
