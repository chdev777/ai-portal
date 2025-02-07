import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userTypeId = params.id;

    // このユーザータイプを使用しているユーザーを検索
    const usersCount = await prisma.user.count({
      where: {
        userTypeId: userTypeId,
      },
    });

    // このユーザータイプを使用しているアプリを検索
    const appsCount = await prisma.chatApp.count({
      where: {
        userTypes: {
          some: {
            id: userTypeId,
          },
        },
      },
    });

    return NextResponse.json({
      isInUse: usersCount > 0 || appsCount > 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ユーザータイプの使用状況の確認に失敗しました" },
      { status: 500 }
    );
  }
}
