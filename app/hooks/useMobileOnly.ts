"use client";

import { useEffect, useState } from "react";

export function useMobileOnly() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      // ป้องกันกรณีแปลก ๆ
      if (typeof window === "undefined") return;

      const ua = (navigator.userAgent || "").toLowerCase();

      // ไม่เอา iPad desktop mode ที่ชอบปลอมเป็น Mac (ถ้าจะ “กันเข้ม” ให้รวม iPad ด้วย)
      const isMobileUA =
        /iphone|ipod|ipad|android|mobile|windows phone/.test(ua);

      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

      const hasTouch =
        navigator.maxTouchPoints > 0 ||
        // บาง TS จะงอแงกับ "ontouchstart" in window เลยใช้แบบนี้
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

      setIsMobile(Boolean(isMobileUA && isSmallScreen && hasTouch));
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile; // null = ยังไม่รู้ (ตอนแรก)
}
