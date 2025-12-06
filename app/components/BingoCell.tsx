"use client";
import { useRef, useState } from "react";
import "../bingo/bingo.css";

export function BingoCell({ text }: { text: string }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [completed, setCompleted] = useState(false);

  const handleClick = () => {
    fileInput.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompleted(true); // อัพโหลดแล้ว = complete
    }
  };

  return (
    <div className="bingo-cell" onClick={handleClick}>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <div className="cell-text">{text}</div>

      {completed && <div className="checkmark">✓</div>}
    </div>
  );
}
