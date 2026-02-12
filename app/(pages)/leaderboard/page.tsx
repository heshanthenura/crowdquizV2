"use client";

import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<
    {
      id: number;
      user_id: string;
      rank: string;
      full_name: string;
      picture: string;
      created_at: Date;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/leaderboard/get");
      const result = await response.json();
      setLeaders(result.data);
    };
    fetchData();
  }, []);

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
              <div className="col-span-2 text-right">Quizzes</div>
              <div className="col-span-2 text-right">Accuracy</div>
              <div className="col-span-2 text-right">Points</div>
            </div>
            <div className="divide-y divide-gray-100">
              {leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 text-sm text-gray-700"
                >
                  <div className="col-span-1 font-semibold text-gray-900">
                    {index + 1}
                  </div>
                  <div className="col-span-5 flex items-center gap-3 font-medium text-gray-900">
                    <Image
                      width={10}
                      height={10}
                      src={leader.picture}
                      alt={leader.full_name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span>{leader.full_name}</span>
                  </div>
                  <div className="col-span-2 text-right">-1</div>
                  <div className="col-span-2 text-right">-1</div>
                  <div className="col-span-2 text-right font-semibold text-blue-600">
                    -1
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
