import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/firebase/admin";
import { askGemini } from "@/lib/chat/gemini";
import { answerScheduleQuestion } from "@/lib/chat/schedule-intent";

interface ChatBody {
  question: string;
}

export async function POST(req: NextRequest) {
  const userId = await verifyBearerToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as ChatBody;
  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  const geminiAnswer = await askGemini(question, userId);
  const answer =
    geminiAnswer ?? (await answerScheduleQuestion(question, userId));
  return NextResponse.json({ answer });
}

