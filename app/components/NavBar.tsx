"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { supabase } from "@/app/utils/supabase";
import { useAuth } from "@/app/context/AuthContext";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: globalThis.location.origin },
    });
    if (error) console.error("Login error:", error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  };

  if (loading) return null;

  return (
    <nav className="w-full">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center py-1 px-6">
        <h1 className="text-2xl font-bold text-gray-900">CrowdQuiz</h1>

        <div className="hidden md:flex justify-center items-center gap-6 text-gray-800 font-medium">
          <Link
            href="/"
            className="hover:text-gray-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/"
            className="hover:text-gray-500 transition-colors duration-200"
          >
            Quizzes
          </Link>
          <Link
            href="/"
            className="hover:text-gray-500 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/"
            className="hover:text-gray-500 transition-colors duration-200"
          >
            Profile
          </Link>
        </div>

        <div className="hidden md:flex gap-3">
          {!user && (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              Login with Google
            </button>
          )}
          {user && (
            <>
              <Link
                href="/add-quiz"
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Add Quiz
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-900 text-2xl focus:outline-none"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-3 border-t border-gray-200">
          <Link
            href="/"
            className="block text-gray-800 hover:text-gray-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/"
            className="block text-gray-800 hover:text-gray-500 transition-colors duration-200"
          >
            Quizzes
          </Link>
          <Link
            href="/"
            className="block text-gray-800 hover:text-gray-500 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/"
            className="block text-gray-800 hover:text-gray-500 transition-colors duration-200"
          >
            Profile
          </Link>

          <div className="flex flex-col gap-3 mt-2">
            {!user && (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Login with Google
              </button>
            )}
            {user && (
              <>
                <Link
                  href="/add-quiz"
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200 text-center"
                >
                  Add Quiz
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-200 text-center"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
