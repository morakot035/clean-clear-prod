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
      <div
        className="
          relative w-full h-screen 
          bg-no-repeat bg-center bg-contain 
          md:bg-cover md:h-[720px] md:max-w-[1280px]
        "
        style={{ backgroundImage: "url('/clean-clear-bg.jpg')" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="
              w-[88%] max-w-2xl 
              translate-y-24 sm:translate-y-32 md:translate-y-40
            "
          >
            <div className="space-y-0">
              {/* รหัสพนักงาน */}
              <div
                className="
                  grid 
                  grid-cols-[130px_minmax(0,1fr)]
                  sm:grid-cols-[150px_minmax(0,1fr)]
                  bg-[#dce6be] 
                  rounded-t-lg
                  p-2 
                  shadow-md
                "
              >
                <label className="flex items-center font-semibold text-black pl-2">
                  รหัสพนักงาน
                </label>

                <input
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="
                    h-10 bg-white rounded-md border border-gray-300 
                    px-3 text-sm w-full focus:ring-2 focus:ring-green-500
                  "
                  placeholder="กรอกรหัสพนักงาน"
                />
              </div>

              {/* ฝ่าย (Dropdown) */}
              <div
                className="
                  grid 
                  grid-cols-[130px_minmax(0,1fr)]
                  sm:grid-cols-[150px_minmax(0,1fr)]
                  bg-[#dce6be] 
                  rounded-b-lg
                  p-2 
                  shadow-md
                "
              >
                <label className="flex items-center font-semibold text-black pl-2">
                  ฝ่าย
                </label>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="
                    h-10 bg-white rounded-md border border-gray-300 
                    px-3 text-sm w-full focus:ring-2 focus:ring-green-500
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
              </div>
            </div>

            <button
              type="submit"
              className="
                mt-3 w-full h-10 bg-[#ffb800] 
                text-[#4a2100] font-bold rounded-md shadow-md 
                active:scale-95 transition
              "
            >
              เข้าร่วมกิจกรรม
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
