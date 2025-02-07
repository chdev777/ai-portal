import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SUPERUSERまたはADMINのみアクセス可能
    if (!["SUPERUSER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userTypes = await prisma.userType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(userTypes);
  } catch (error) {
    console.error("Error in GET /api/user-types:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const json = await request.json();
    const { name } = json;

    const existingUserType = await prisma.userType.findFirst({
      where: { name },
    });

    if (existingUserType) {
      return NextResponse.json(
        { error: "同じ名前のユーザータイプが既に存在します" },
        { status: 400 }
      );
    }

    const userType = await prisma.userType.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(userType);
  } catch (error) {
    console.error("Error creating user type:", error);
    return NextResponse.json(
      { error: "ユーザータイプの作成に失敗しました" },
      { status: 500 }
    );
  }
}
