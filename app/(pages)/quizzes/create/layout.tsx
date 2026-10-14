import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Quiz",
  robots: { index: false, follow: false },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
