"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { BingoCell } from "../components/BingoCell";
import { apiClient, BingoTask } from "../services/apiClient";
import { useLoading } from "../context/LoadingContext";
import { useMobileOnly } from "../hooks/useMobileOnly";
import Swal from "sweetalert2";
import "./bingo.css";

/* ===== BINGO LINES (3x3) ===== */
const BINGO_LINES = [
  [0, 1, 2], // แนวนอน
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // แนวตั้ง
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // ทแยง
  [2, 4, 6],
];

function getBingoResult(tasks: BingoTask[]) {
  const completedLines = BINGO_LINES.filter((line) =>
    line.every((idx) => tasks[idx]?.completed === true)
  );

  return {
    count: completedLines.length,
    completedLines,
  };
}

export default function BingoPage() {
  useAuthGuard();
  const isMobile = useMobileOnly();
  const { showLoading, hideLoading } = useLoading();

  const [tasks, setTasks] = useState<BingoTask[]>([]);
  const [bingoCount, setBingoCount] = useState(0);
  const [completedLines, setCompletedLines] = useState<number[][]>([]);

  /* ===== โหลด progress ===== */
  useEffect(() => {
    async function loadProgress() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        showLoading();
        const res = await apiClient.getProgress(token);
        const loadedTasks = res.progress.tasks || [];

        setTasks(loadedTasks);

        const result = getBingoResult(loadedTasks);
        setBingoCount(result.count);
        setCompletedLines(result.completedLines);
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }

    loadProgress();
  }, []);

  /* ===== upload จาก cell ===== */
  async function handleUpload(index: number, file: File) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      showLoading();

      const oldResult = getBingoResult(tasks);

      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await apiClient.uploadImage(formData, token);
      const res = await apiClient.updateTask(index, uploadRes.imageUrl, token);

      const updatedTasks = res.progress.tasks || [];
      setTasks(updatedTasks);

      const newResult = getBingoResult(updatedTasks);
      setBingoCount(newResult.count);
      setCompletedLines(newResult.completedLines);

      if (newResult.count > oldResult.count) {
        Swal.fire({
          title: "🎉 BINGO!",
          html: `
            คุณได้บิงโกเพิ่ม <b>${
              newResult.count - oldResult.count
            }</b> เส้น<br/>
            รวมทั้งหมด <b>${newResult.count}</b> เส้น
          `,
          icon: "success",
          confirmButtonText: "เยี่ยมเลย!",
          confirmButtonColor: "#22c55e",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "อัปโหลดไม่สำเร็จ",
        icon: "error",
      });
    } finally {
      hideLoading();
    }
  }

  /* ===== ช่องที่อยู่ในเส้น BINGO ===== */
  const bingoCells = new Set<number>(completedLines.flat());

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded shadow text-center max-w-sm">
          <h1 className="text-xl font-bold mb-2">
            📱 ใช้งานผ่านมือถือเท่านั้น
          </h1>
          <p className="text-gray-600 mb-4">
            กรุณาเปิดหน้านี้จากโทรศัพท์มือถือ
          </p>
          <p className="text-sm text-gray-400">
            (Mobile Browser เช่น Safari / Chrome)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bingo-wrapper">
      <div className="bingo-content">
        <div className="bingo-container">
          <h1 className="title">Christmas</h1>
          <h2 className="subtitle">BINGO</h2>

          {/* แสดงดาวที่มีตอนนี้ (จะไม่โชว์ก็ได้) */}
          <p className="current-stars"> 🎯 BINGO ที่ได้: {bingoCount}</p>

          {/* Bingo Grid */}
          <div className="bingo-grid">
            {tasks.map((task) => (
              <BingoCell
                key={task.index}
                index={task.index}
                text={task.title}
                completed={task.completed}
                isBingo={bingoCells.has(task.index)}
                onUpload={handleUpload}
              />
            ))}
          </div>

          {/* Reward Text */}
          {/* <div className="reward-section">
            <p className="reward-text">
              สะสมครบ 1 แถว เท่ากับ 1 ดาว = แลกรับของรางวัล
            </p>

            <div className="reward-stars">
              <div className="star-group">
                <div className="stars">⭐</div>
                <div className="label">ขนม</div>
              </div>

              <div className="star-group">
                <div className="stars">⭐⭐</div>
                <div className="label">ของขวัญ</div>
              </div>

              <div className="star-group">
                <div className="stars">⭐⭐⭐</div>
                <div className="label">voucher</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
