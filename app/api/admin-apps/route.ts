import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = {
      where:
        session.user.role === "SUPERUSER" ? undefined : { isAdminOnly: true },
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

    const adminApps = await prisma.chatApp.findMany(query);
    return NextResponse.json(adminApps);
  } catch (error) {
    console.error("Error fetching admin apps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const adminApp = await prisma.chatApp.create({
      data: {
        name: json.name,
        description: json.description,
        details: json.details,
        url: json.url,
        isAdminOnly: true,
        createdById: session.user.id,
        userTypes: {
          connect: [{ id: session.user.userType }],
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

    return NextResponse.json(adminApp);
  } catch (error) {
    console.error("Error creating admin app:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
