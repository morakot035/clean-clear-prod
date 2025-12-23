"use client";

import { useRef } from "react";
import "../bingo/bingo.css";

interface BingoCellProps {
  index: number;
  text: string;
  completed: boolean;
  isBingo?: boolean;
  onUpload: (index: number, file: File) => void;
}

export function BingoCell({
  index,
  text,
  completed,
  isBingo,
  onUpload,
}: BingoCellProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onUpload(index, e.target.files[0]);
  };

  return (
    <div
      className={`bingo-cell ${completed ? "completed" : ""} ${
        isBingo ? "bingo-win" : ""
      }`}
      onClick={handleClick}
    >
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
