import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tagId: string }>;
  }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { tagId } = await params;
    const userId = session.user?.id;
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
        userId,
      },
    });
    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }
    await prisma.tag.delete({
      where: {
        id: tagId,
      },
    });
    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
