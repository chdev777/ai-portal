import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userTypeId = searchParams.get("userTypeId");

    const query = {
      where: {},
      include: {
        userTypes: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    };

    if (userTypeId && userTypeId !== "all") {
      query.where = {
        userTypes: {
          some: {
            id: userTypeId,
          },
        },
      };
    }

    const chatApps = await prisma.chatApp.findMany(query);
    return NextResponse.json(chatApps);
  } catch (error) {
    console.error("Error fetching chat apps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ["ADMIN", "SUPERUSER"].includes(session.user.role);
    const isSuperUser = session.user.role === "SUPERUSER";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const {
      name,
      description,
      details,
      url,
      userTypeIds,
      isVisibleToAll,
      isAdminOnly,
    } = json;

    // システム管理者以外は管理者専用アプリを作成できない
    if (isAdminOnly && !isSuperUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // userTypeIdsの検証
    if (!userTypeIds || !Array.isArray(userTypeIds)) {
      return NextResponse.json(
        { error: "Invalid userTypeIds format" },
        { status: 400 }
      );
    }

    const chatApp = await prisma.chatApp.create({
      data: {
        name,
        description,
        details,
        url,
        isVisibleToAll,
        isAdminOnly: isAdminOnly || false,
        createdById: session.user.id,
        userTypes: {
          connect:
            userTypeIds.length > 0
              ? userTypeIds.map((id) => ({ id }))
              : [{ id: session.user.userType }],
        },
      },
      include: {
        userTypes: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(chatApp);
  } catch (error) {
    console.error("Error creating chat app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { id, ...updateData } = json;

    const chatApp = await prisma.chatApp.update({
      where: { id },
      data: updateData,
      include: {
        userTypes: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(chatApp);
  } catch (error) {
    console.error("Error updating chat app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.chatApp.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
