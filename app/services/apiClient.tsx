const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Bingo types ---
export type BingoTask = {
  index: number;
  title: string;
  completed: boolean;
  imageUrl?: string;
};

export type BingoProgress = {
  employeeId: string;
  department: string;
  fullName: string;
  tasks: BingoTask[];
};

export type BingoProgressResponse = {
  success: boolean;
  progress: BingoProgress;
};

async function apiRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    // รองรับได้ทั้งกรณี message และ error.message
    const message =
      data?.message || data?.error?.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
    throw new Error(message);
  }

  return data;
}

export const apiClient = {
  login: (department: string, employeeId: string) =>
    apiRequest<{ token: string }>("/api/auth/login", "POST", {
      department,
      employeeId,
    }),

  // โหลด progress
  getProgress: (token: string) =>
    apiRequest<BingoProgressResponse>(
      "/api/bingo/progress",
      "GET",
      undefined,
      token
    ),

  // อัปเดต task ที่ทำแล้ว
  updateTask: (taskIndex: number, imageUrl: string, token: string) =>
    apiRequest<BingoProgressResponse>(
      "/api/bingo/update",
      "POST",
      { taskIndex, imageUrl },
      token
    ),
};
