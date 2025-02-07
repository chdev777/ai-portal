import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FeedbackStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPERUSER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!feedback) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ステータス更新用のエンドポイントを追加
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPERUSER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    console.log("Received status:", status); // デバッグ用

    // statusの型を確認
    if (typeof status !== "string") {
      return new NextResponse("Status must be a string", { status: 400 });
    }

    // 有効なステータス値かチェック
    const validStatuses = Object.values(FeedbackStatus);
    if (!validStatuses.includes(status as FeedbackStatus)) {
      return new NextResponse(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        { status: 400 }
      );
    }

    console.log("Updating feedback with status:", status); // デバッグ用

    const feedback = await prisma.feedback.update({
      where: {
        id: params.id,
      },
      data: {
        status: status as FeedbackStatus,
      },
    });

    console.log("Updated feedback:", feedback); // デバッグ用

    return NextResponse.json(feedback);
  } catch (error) {
    // エラーの詳細をログに出力
    console.error("Error updating feedback:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
