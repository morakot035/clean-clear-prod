"use client";
import Image from "next/image";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { BingoCell } from "../components/BingoCell";
import "./bingo.css";

export default function BingoPage() {
  useAuthGuard();

  const cells = [
    "เคลียร์ไฟล์ในDesktop",
    "จัดเก็บเอกสารบนโต๊ะ 1 จุดหากมีกาวใส่เอกสาร",
    "ทำความสะอาด Notebook/ Keyboard/ Mouse",
    "เคลียร์เอกสารที่ไม่ได้ใช้เกิน 3 ปี",
    "จัดโต๊ะทำงานให้เป็นระเบียบ",
    "ติด Label ใหม่ 2 จุด เพื่อบ่งชี้",
    "โต๊ะทำงานมีของไม่จำเป็นไม่เกิน 2 ชิ้น",
    "อุปกรณ์สำนักงานจัดเก็บในลิ้นชัก/บนโต๊ะเรียบร้อย",
    "อุปกรณ์สำนักงานจัดเก็บในลิ้นชัก/บนโต๊ะเรียบร้อย",
  ];
  return (
    <div className="bingo-container">
      <h1 className="title">Christmas</h1>
      <h2 className="subtitle">BINGO</h2>

      {/* Bingo Grid */}
      <div className="bingo-grid">
        {cells.map((text, i) => (
          <BingoCell key={i} text={text} />
        ))}
      </div>

      {/* Reward Text */}
      <div className="reward-section">
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
      </div>
    </div>
  );
}
