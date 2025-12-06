"use client";

import { useState } from "react";
import { apiClient } from "../services/apiClient";
import { useRouter } from "next/navigation";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const { showToast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      showLoading();

      const res = await apiClient.login(department, employeeId);

      // บันทึก Token
      localStorage.setItem("token", res.token);

      document.cookie = `token=${res.token}; path=/; max-age=604800`;
      // redirect หลัง login สำเร็จ
      showToast("เข้าสู่ระบบสำเร็จ!", "success");
      router.push("/bingo");
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message || "เข้าสู่ระบบไม่สำเร็จ", "error");
      } else {
        showToast("เข้าสู่ระบบล้มเหลว", "error");
      }
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
            {/* --- กล่องฟอร์ม 2 แถวติดกัน --- */}
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

              {/* ฝ่าย */}
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

                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="
                    h-10 bg-white rounded-md border border-gray-300 
                    px-3 text-sm w-full focus:ring-2 focus:ring-green-500
                  "
                  placeholder="ระบุฝ่าย"
                />
              </div>
            </div>

            {/* Error message */}

            {/* ปุ่ม */}
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
