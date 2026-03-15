"use client";

import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react";
import { getSessionAccessToken } from "@/app/utils/helpers";

type LeaderboardItem = {
  id: number;
  user_id: string;
  xp: number;
  full_name: string;
  picture: string;
  created_at: Date;
};

type MyRankItem = LeaderboardItem & {
  rank: number;
};

const PAGE_SIZE = 10;

function hasValidImageSrc(src: string | null | undefined) {
  return typeof src === "string" && src.trim().length > 0;
}

function getInitial(name: string | null | undefined) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const [me, setMe] = useState<MyRankItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/leaderboard/get?page=${currentPage}`);
      if (!response.ok) return;
      const result = await response.json();
      setLeaders(result.data);
      setTotalPages(result.pagination?.totalPages ?? 1);
    };

    const fetchMe = async () => {
      const token = await getSessionAccessToken();
      if (!token) return;

      const response = await fetch("/api/leaderboard/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const result = await response.json();
      setMe(result.data ?? null);
    };

    fetchData();
    fetchMe();
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className=" max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="w-full text-3xl font-bold text-gray-900 mb-6">
            Leaderboard
          </h1>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 text-sm font-semibold text-gray-500">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-2 text-right">XP</div>
            </div>
            <div className="divide-y divide-gray-100">
              {me && (
                <div className="bg-gray-200 grid grid-cols-12 gap-4 px-6 py-4 text-sm text-gray-700">
                  <div className="col-span-1 font-semibold text-gray-900">
                    {me.rank}
                  </div>
                  <div className="col-span-5 flex items-center gap-3 font-medium text-gray-900">
                    {hasValidImageSrc(me.picture) ? (
                      <Image
                        width={36}
                        height={36}
                        src={me.picture}
                        alt={me.full_name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
                        {getInitial(me.full_name)}
                      </div>
                    )}
                    <span>{me.full_name} (You)</span>
                  </div>
                  <div className="col-span-2 text-right">
                    {me.xp.toFixed(2)}
                  </div>
                </div>
              )}
              {leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 text-sm text-gray-700"
                >
                  <div className="col-span-1 font-semibold text-gray-900">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </div>
                  <div className="col-span-5 flex items-center gap-3 font-medium text-gray-900">
                    {hasValidImageSrc(leader.picture) ? (
                      <Image
                        width={36}
                        height={36}
                        src={leader.picture}
                        alt={leader.full_name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                        {getInitial(leader.full_name)}
                      </div>
                    )}
                    <span>{leader.full_name}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    {leader.xp.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
