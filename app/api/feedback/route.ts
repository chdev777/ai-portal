import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// フィードバック一覧取得 (管理者のみ)
export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPERUSER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// フィードバック投稿
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, department, name } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        department,
        name,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
