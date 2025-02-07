import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: json,
      include: {
        userType: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // 認証チェック
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // SUPERUSER権限チェック
    if (session.user.role !== "SUPERUSER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 自分自身の削除を防ぐ
    if (params.id === session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: "自分自身は削除できません" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "ユーザーが見つかりません" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // ユーザーの削除
    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
