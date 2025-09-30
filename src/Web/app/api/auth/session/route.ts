import { getUserFromSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromSession();
  return NextResponse.json(user);
}