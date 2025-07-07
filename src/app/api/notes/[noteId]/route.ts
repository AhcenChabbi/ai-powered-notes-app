import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tagsSchema } from "@/lib/schemas/schemas";
// import { generateEmbedding } from "@/lib/utils/embedding";
import { convert } from "html-to-text";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  deletedAt: z
    .string()
    .transform((val) => new Date(val))
    .optional()
    .nullable(),
  tags: tagsSchema.optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const userId = session.user?.id;
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    const body = await req.json();
    const validatedNote = schema.safeParse(body);
    if (!validatedNote.success) {
      return NextResponse.json(
        { message: "Invalid note data", errors: validatedNote.error.errors },
        { status: 400 }
      );
    }
    const { content, deletedAt, isFavorite, isPinned, summary, tags, title } =
      validatedNote.data;
    const existingTags = await prisma.tag.findMany({
      where: {
        userId,
        name: { in: tags?.map((tag) => tag.name) },
      },
    });
    const updatedNote = await prisma.note.update({
      where: { id: noteId, userId },
      data: {
        ...note,
        ...(title && { title }),
        ...(content && {
          content,
          plainTextContent: convert(content, { wordwrap: false }),
        }),
        ...(summary && { summary }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isPinned !== undefined && { isPinned }),
        ...(deletedAt !== undefined && { deletedAt }),
        ...(tags && {
          tags: {
            set: [],
            connect: existingTags.map((tag) => ({ id: tag.id })),
            create: tags
              .filter(
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
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Error updating note", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const { noteId } = await params;
    const userId = session.user?.id;
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    await prisma.note.delete({
      where: {
        id: noteId,
        userId,
      },
    });
    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting note", error },
      { status: 500 }
    );
  }
}
