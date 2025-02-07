import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatApp = await prisma.chatApp.findUnique({
      where: { id: params.id },
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

    if (!chatApp) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(chatApp);
  } catch (error) {
    console.error("Error fetching chat app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ["ADMIN", "SUPERUSER"].includes(session.user.role);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const { name, description, details, url, isVisibleToAll, userTypeIds } =
      json;

    const chatApp = await prisma.chatApp.update({
      where: { id: params.id },
      data: {
        name,
        description,
        details,
        url,
        isVisibleToAll,
        userTypes: {
          set: userTypeIds.map((id: string) => ({ id })),
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
    console.error("Error updating chat app:", error);
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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ["ADMIN", "SUPERUSER"].includes(session.user.role);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.chatApp.delete({
      where: { id: params.id },
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
