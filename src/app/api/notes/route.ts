import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/lib/schemas/schemas";
import { convert } from "html-to-text";
import {
  parseAsFilter,
  parseAsPageNumber,
  parseAsSearch,
  parseAsTags,
} from "@/lib/utils/parsers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      redirect("/login");
    }
    const userId = user.id;
    const searchParams = req.nextUrl.searchParams;
    const tags = parseAsTags.parseServerSide(searchParams.get("tags") || "");
    const filter = parseAsFilter.parseServerSide(
      searchParams.get("filter") || "all"
    );
    const page = parseAsPageNumber.parseServerSide(
      searchParams.get("page") || "1"
    );
    const limit = 10;
    const search = parseAsSearch.parseServerSide(
      searchParams.get("search") || ""
    );
    const whereClause = {
      userId,
      ...(search && {
        title: { contains: search, mode: "insensitive" as const },
        content: { contains: search, mode: "insensitive" as const },
      }),
      ...(filter === "pinned" && { isPinned: true }),
      ...(filter === "favorites" && { isFavorite: true }),
      ...(filter === "trash" && { deletedAt: { not: null } }),
      ...(filter === "all" && { deletedAt: null }),
      ...(tags &&
        tags.length > 0 && {
          tags: { some: { name: { in: tags } } },
        }),
    };
    const totalCount = await prisma.note.count({ where: whereClause });
    const notes = await prisma.note.findMany({
      where: whereClause,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      take: limit,
      skip: (page - 1) * limit,
    });
    const hasMore = page * limit < totalCount;
    const nextPage = hasMore ? page + 1 : null;
    return NextResponse.json(
      {
        notes,
        pagination: {
          currentPage: page,
          nextPage,
          hasMore,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      redirect("/login");
    }
    const body = await req.json();
    const validatedData = noteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: validatedData.error.issues },
        { status: 400 }
      );
    }
    const userId = user.id;
    const { title, content, tags, isFavorite, isPinned, summary } =
      validatedData.data;
    const plainTextContent = convert(content, { wordwrap: false });
    const existingTags = await prisma.tag.findMany({
      where: {
        userId,
        name: { in: tags?.map((tag) => tag.name) },
      },
    });
    const note = await prisma.note.create({
      data: {
        title,
        summary,
        content,
        isFavorite,
        isPinned,
        plainTextContent,
        user: {
          connect: { id: userId },
        },
        ...(tags && {
          tags: {
            connect: existingTags.map((tag) => ({ id: tag.id })),
            create: tags
              ?.filter(
                (tag) =>
                  !existingTags.some(
                    (existingTag) => existingTag.name === tag.name
                  )
              )
              .map((tag) => ({
                name: tag.name,
                color: tag.color,
                user: {
                  connect: { id: userId },
                },
              })),
          },
        }),
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
    return NextResponse.json(note, {
      status: 201,
    });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 }
    );
  }
}
