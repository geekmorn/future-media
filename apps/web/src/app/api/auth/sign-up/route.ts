import { NextResponse } from "next/server";

interface SignUpRequest {
  name: string;
  password: string;
}

// Mock user database (заглушка)
const MOCK_USERS: Array<{
  id: string;
  name: string;
  password: string;
}> = [
  {
    id: "1",
    name: "testuser",
    password: "password123",
  },
  {
    id: "2",
    name: "admin",
    password: "admin123",
  },
];

export async function POST(request: Request) {
  try {
    const body: SignUpRequest = await request.json();
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

    // Проверка, существует ли пользователь с таким именем
    const existingUser = MOCK_USERS.find(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this name already exists" },
        { status: 409 }
      );
    }

    // Создание нового пользователя
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name: name.trim(),
      password: password, // В реальном приложении используйте bcrypt
    };

    MOCK_USERS.push(newUser);

    // Успешная регистрация
    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
