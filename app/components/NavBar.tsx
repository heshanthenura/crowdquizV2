"use client";
import { useEffect, useState, useTransition } from "react";
import { BookOpen, LogIn, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/quizzes", label: "Quizzes" },
    { href: "/quizzes/create", label: "Create Quiz", requireAuth: true },
    { href: "/about", label: "About" },
    { href: "/profile", label: "Profile", requireAuth: true },
  ].filter((link) => !link.requireAuth || user);

  useEffect(() => {
    startTransition(() => {
      setOpen(false);
    });
  }, [pathname]);

  const authButton = (
    <button
      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
      onClick={user ? signOut : signInWithGoogle}
      disabled={loading}
    >
      {user ? (
        <>
          <LogOut className="w-4 h-4" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          Login with Google
        </>
      )}
    </button>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              CrowdQuiz
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
            {authButton}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block text-sm transition-colors ${
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
            <div>{authButton}</div>
          </div>
        </div>
      )}
    </nav>
  );
}
