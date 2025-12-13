import { NextResponse } from "next/server";

interface SignInRequest {
  name: string;
  password: string;
}

// Mock user database (заглушка)
const MOCK_USERS = [
  {
    id: "1",
    name: "testuser",
    password: "password123", // В реальном приложении это должен быть хеш
  },
  {
    id: "2",
    name: "admin",
    password: "admin123",
  },
];

export async function POST(request: Request) {
  try {
    const body: SignInRequest = await request.json();
    const { name, password } = body;

    // Валидация
    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Поиск пользователя
    const user = MOCK_USERS.find(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Проверка пароля (в реальном приложении используйте bcrypt или аналогичный)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Успешный вход
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

