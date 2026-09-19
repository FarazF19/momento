import { NextResponse } from "next/server";
// The legacy anonymous intake must not bypass verified creator accounts.
export async function POST() {
  return NextResponse.json({ error: "Use the signed-in creator listing flow at /list." }, { status: 410 });
}
