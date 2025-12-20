"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { BingoCell } from "../components/BingoCell";
import { apiClient, BingoTask } from "../services/apiClient";
import { useLoading } from "../context/LoadingContext";
import Swal from "sweetalert2";
import "./bingo.css";

// คำนวณจำนวนดาวจาก tasks (ดูจาก field completed)
function calculateStars(tasks: BingoTask[]): number {
  if (!tasks || tasks.length === 0) return 0;

  const rows = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
  ];

  let stars = 0;

  for (const row of rows) {
    const isDone = row.every((idx) => tasks[idx]?.completed === true);
    if (isDone) stars += 1;
  }

  return Math.min(stars, 3); // จำกัดสูงสุด 3 ดาว
}

export default function BingoPage() {
  useAuthGuard();
  const { showLoading, hideLoading } = useLoading();
  const [tasks, setTasks] = useState<BingoTask[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [prevStars, setPrevStars] = useState<number>(0);

  // โหลด progress ตอนเปิดหน้า
  useEffect(() => {
    async function loadProgress() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        showLoading(); // ⬅️ แสดงโหลด

        const res = await apiClient.getProgress(token);
        const loadedTasks = res.progress.tasks || [];
        setTasks(res.progress.tasks);

        const initialStars = calculateStars(loadedTasks);
        setStars(initialStars);
        setPrevStars(initialStars);
      } catch (err) {
        console.error("โหลด progress ไม่สำเร็จ:", err);
      } finally {
        hideLoading(); // ⬅️ ปิดโหลด
      }
    }

    loadProgress();
  }, []);

  // เวลาอัปโหลดจาก cell ใด cell หนึ่ง

  async function handleUpload(index: number, file: File): Promise<void> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      showLoading();

      // ตอนนี้ mock imageUrl = file.name
      // ถ้ามีระบบอัปโหลดจริง ค่อยเปลี่ยนเป็น URL จาก backend
      //const imageUrl = file.name;

      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await apiClient.uploadImage(formData, token);

      const oldStars = calculateStars(tasks);

      const res = await apiClient.updateTask(index, uploadRes.imageUrl, token);

      const updatedTasks = res.progress.tasks || [];
      setTasks(updatedTasks);

      const newStars = calculateStars(updatedTasks);

      // ถ้าได้ดาวเพิ่ม
      if (newStars > oldStars) {
        setStars(newStars);
        setPrevStars(newStars);

        const gained = newStars - oldStars;

        Swal.fire({
          title: "🎉 ยินดีด้วย!",
          html: `
            คุณสะสมครบอีก <b>${gained} แถว</b><br/>
            ⭐ ดาวเพิ่มจาก <b>${oldStars}</b> → <b>${newStars}</b>
          `,
          icon: "success",
          confirmButtonText: "เยี่ยมเลย!",
          confirmButtonColor: "#ff6f3c",
          background: "#fff9f4",
          // ✅ animation เข้า
          showClass: {
            popup: "animate__animated animate__zoomIn animate__faster",
          },
          // ✅ animation ออก
          hideClass: {
            popup: "animate__animated animate__zoomOut animate__faster",
          },
          // ✅ backdrop ฟุ้ง ๆ หน่อย
          backdrop: `
            rgba(0,0,0,0.4)
            left top
            no-repeat
          `,
        });
      } else {
        setStars(newStars);
        setPrevStars(newStars);
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#e11d48",
        background: "#fff1f2",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut",
        },
      });
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="bingo-wrapper">
      <div className="bingo-content">
        <div className="bingo-container">
          <h1 className="title">Christmas</h1>
          <h2 className="subtitle">BINGO</h2>

          {/* แสดงดาวที่มีตอนนี้ (จะไม่โชว์ก็ได้) */}
          <p className="current-stars">คุณมีดาวสะสมทั้งหมด: {stars} ⭐</p>

          {/* Bingo Grid */}
          <div className="bingo-grid">
            {tasks.map((task) => (
              <BingoCell
                key={task.index}
                index={task.index}
                text={task.title}
                completed={task.completed}
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
