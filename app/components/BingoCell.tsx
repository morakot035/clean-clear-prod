"use client";

import { useRef } from "react";
import "../bingo/bingo.css";

interface BingoCellProps {
  index: number;
  text: string;
  completed: boolean;
  onUpload: (index: number, file: File) => void;
}

export function BingoCell({
  index,
  text,
  completed,
  onUpload,
}: BingoCellProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    // ถ้าอยากไม่ให้เปลี่ยนรูปเมื่อทำแล้วก็กันไว้ตรงนี้
    // if (completed) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    onUpload(index, file);
  };

  return (
    <div className="bingo-cell" onClick={handleClick}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="cell-text">{text}</div>

      {completed && <div className="checkmark">✓</div>}
    </div>
  );
}
