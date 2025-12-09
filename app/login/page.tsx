"use client";

import { useState } from "react";
import { apiClient } from "../services/apiClient";
import { useRouter } from "next/navigation";
import { useLoading } from "../context/LoadingContext";

import Swal from "sweetalert2";

const DEPARTMENTS = [
  "ฝ่ายผลิต",
  "ฝ่ายจัดซื้อ",
  "ฝ่ายคลังสินค้า",
  "ฝ่ายบุคคล",
  "ฝ่ายธุรการ",
  "ฝ่ายอื่นๆ",
];

export default function LoginPage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!employeeId.trim() || !department) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "ต้องกรอกรหัสพนักงานและเลือกฝ่ายก่อนเข้าร่วมกิจกรรม",
        icon: "warning",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f97316",
        background: "#fff7ed",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut",
        },
      });
      return;
    }

    try {
      showLoading();

      const res = await apiClient.login(department, employeeId);

      localStorage.setItem("token", res.token);
      document.cookie = `token=${res.token}; path=/; max-age=604800`;

      await Swal.fire({
        title: "🎄 เข้าสู่ระบบสำเร็จ!",
        html: `ยินดีต้อนรับสู่กิจกรรม <b>Christmas Clean & Clear</b>`,
        icon: "success",
        confirmButtonText: "เริ่มเล่น BINGO",
        confirmButtonColor: "#22c55e",
        background: "#f0fdf4",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      });
      router.push("/bingo");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ";
      Swal.fire({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: message,
        icon: "error",
        confirmButtonText: "ลองใหม่อีกครั้ง",
        confirmButtonColor: "#ef4444",
        background: "#fef2f2",
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
    <main className="min-h-screen flex items-center justify-center bg-[#00163a]">
      {/* พื้นหลังเต็มจอ */}
      <div
        className="
          relative w-full h-screen
          bg-[url('/login.png')]
          bg-no-repeat bg-cover bg-top
          md:max-w-[1280px]
        "
      >
        {/* ฟอร์มวางทับ “ในกรอบเขียว” */}
        <form
          onSubmit={handleLogin}
          className="
            absolute
            /* ลองจูนสองตัวนี้ ถ้ายังไม่ตรงเป๊ะ */
            top-[64%]           /* ขยับขึ้นลง */
            left-[66%]          /* ขยับซ้ายขวา */
            
            -translate-x-1/2 -translate-y-1/2
            w-[72%] max-w-[240px]   /* ให้กว้างใกล้กรอบเขียว */
            space-y-3
          "
        >
          {/* รหัสพนักงาน */}
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="
              w-full h-12 px-4
              rounded-lg border border-gray-300
              bg-white text-gray-700
              placeholder-gray-400
              focus:ring-2 focus:ring-green-500
              shadow-sm
            "
            placeholder="กรอกรหัสพนักงาน"
          />

          {/* เลือกฝ่าย */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="
              w-full h-12 px-4
              rounded-lg border border-gray-300
              bg-white text-gray-700
              focus:ring-2 focus:ring-green-500
              shadow-sm
            "
          >
            <option value="" disabled>
              เลือกฝ่าย
            </option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* ปุ่ม */}
          <button
            type="submit"
            className="
              w-full h-12
              bg-[#ffb800]
              text-[#4a2100] font-bold
              rounded-lg shadow-md
              active:scale-95
              transition
            "
          >
            เข้าร่วมกิจกรรม
          </button>
        </form>
      </div>
    </main>
  );
}
