import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { personalInfoSchema } from "@/lib/schemas/schemas";
import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;
    const formData = await req.formData();
    const data = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
    };
    const validatedCredentials = personalInfoSchema.safeParse(data);
    if (!validatedCredentials.success) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }
    const { name, image } = validatedCredentials.data;
    const blob = image
      ? await put(image.name, image, {
          access: "public",
          addRandomSuffix: true,
          contentType: image.type,
        })
      : null;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(blob && { image: blob.url }),
      },
    });
    revalidatePath("/dashboard");
    return NextResponse.json(updatedUser);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
