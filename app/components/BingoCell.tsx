"use client";

import React, { useState } from "react";

interface BingoCellProps {
  text: string;
}

export const BingoCell: React.FC<BingoCellProps> = ({ text }) => {
  const [touching, setTouching] = useState(false);

  const triggerTouchAnimation = () => {
    setTouching(true);
    setTimeout(() => setTouching(false), 350); // ให้แอนิเมชันเล่นจบแล้วค่อยเอาออก
  };

  return (
    <div
      className={`bingo-cell ${touching ? "touch-animate" : ""}`}
      onClick={triggerTouchAnimation}
      onTouchStart={triggerTouchAnimation}
    >
      {/* ตัดคำไทยให้อยู่กลางสวย ๆddddd */}
      <span className="bingo-cell-text">{text}</span>
    </div>
  );
};
