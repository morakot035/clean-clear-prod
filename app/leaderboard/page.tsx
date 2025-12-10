"use client";

import { useEffect, useState } from "react";
import { apiClient, BingoTask } from "../services/apiClient";
import { useLoading } from "../context/LoadingContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface TaskImage {
  index: number;
  title: string;
  imageUrl: string;
  uploadedAt: string;
}

interface UserScore {
  employeeId: string;
  fullName: string;
  department: string;
  completedCount: number;
  stars: number;
  images: TaskImage[];
}

export default function LeaderboardPage() {
  useAuthGuard();
  const { showLoading, hideLoading } = useLoading();
  const [data, setData] = useState<UserScore[]>([]);

  useEffect(() => {
    async function loadProgress() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        showLoading(); // ⬅️ แสดงโหลด

        const res = await apiClient.leaderBoard(token);
        setData(res.leaderboard);
        console.log(res);
      } catch (err) {
        console.error("โหลด progress ไม่สำเร็จ:", err);
      } finally {
        hideLoading(); // ⬅️ ปิดโหลด
      }
    }

    loadProgress();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🎉 Leaderboard</h1>

      {data.map((user, i) => (
        <div key={i} className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-bold">
            {user.fullName} ({user.employeeId})
          </h2>
          <p className="text-gray-600">{user.department}</p>

          <p className="mt-2 font-semibold">
            ผ่านแล้ว {user.completedCount} ช่อง → ⭐ {user.stars} ดาว
          </p>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {user.images.map((img, idx) => (
              <div key={idx} className="text-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`}
                  className="w-full rounded shadow"
                />
                <p className="text-xs mt-1">{img.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
