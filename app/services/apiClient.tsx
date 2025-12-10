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

export interface UserScore {
  employeeId: string;
  fullName: string;
  department: string;
  completedCount: number;
  stars: number;
  images: {
    index: number;
    title: string;
    imageUrl: string;
    uploadedAt: string;
  }[];
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: UserScore[];
}

interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
}

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

  leaderBoard: (token: string) =>
    apiRequest<LeaderboardResponse>(
      "/api/bingo/leaderboard",
      "GET",
      undefined,
      token
    ),

  // uploadImage: (formData: FormData, token: string) =>
  //   apiRequest<{ success: boolean; imageUrl: string }>(
  //     "/api/bingo/upload",
  //     "POST",
  //     formData,
  //     token
  //   ),
  uploadImage: async (formData: FormData, token: string) => {
    const res = await fetch(`${BASE_URL}/api/bingo/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // ❌ ห้ามใส่ "Content-Type": "application/json"
      },
      body: formData,
    });

    return res.json();
  },
};
