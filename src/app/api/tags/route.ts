import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/schemas/schemas";
import { parseAsPageNumber } from "@/lib/utils/parsers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        {
          status: 401,
        }
      );
    }
    const userId = session.user?.id;
    const totalCount = await prisma.tag.count({
      where: {
        userId,
      },
    });
    const limit = 5;
    const page = parseAsPageNumber.parseServerSide(
      req.nextUrl.searchParams.get("page") || "1"
    );
    const hasMore = totalCount > page * limit;
    const nextPage = hasMore ? page + 1 : null;
    const tags = await prisma.tag.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return NextResponse.json(
      {
        tags,
        totalCount,
        nextPage,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Failed to retrieve tags", error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const validatedTag = tagSchema.safeParse(body);
    if (!validatedTag.success) {
      return NextResponse.json(
        { message: "Invalid tag data", errors: validatedTag.error.errors },
        { status: 400 }
      );
    }
    const existingTag = await prisma.tag.findUnique({
      where: {
        userId_name: {
          name: validatedTag.data.name,
          userId,
        },
      },
    });
    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 400 }
      );
    }
    const tag = await prisma.tag.create({
      data: {
        name: validatedTag.data.name,
        color: validatedTag.data.color,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create tag", error },
      { status: 500 }
    );
  }
}
