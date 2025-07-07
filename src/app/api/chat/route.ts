import { streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import mistral from "@/lib/mistral";
import { getUserNoteAction } from "@/lib/actions/actions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session || !userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const lastMessages = messages.slice(-10);
  const userNotes = await getUserNoteAction(userId);
  const notesContext = userNotes
    .map((note, i) => {
      return `Note ${i + 1}:\nnoteId: ${note.id}\nTitle: ${
        note.title
      }\nContent: ${note.plainTextContent}`;
    })
    .join("\n\n");
  const result = streamText({
    model: mistral(process.env.MODEL_ID || ""),
    messages: lastMessages,
    temperature: 0.7,
    maxTokens: 1000,
    system: `
      You are a helpful assistant that can search through the user's notes.
      Use the information from the notes to answer questions and provide insights.


      Notes:
      ${notesContext}

      
      If the requested information is not available, respond with "Sorry, I can't find that information in your notes".
      You can use markdown formatting like links, bullet points, numbered lists, and bold text.
       Provide links to relevant notes using this relative URL structure (omit the base URL): '/dashboard?noteId=<note-id>'.
      Keep your responses concise and to the point.
      `,
  });

  return result.toDataStreamResponse();
}
