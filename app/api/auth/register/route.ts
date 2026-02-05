import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: { email: ["An account with this email already exists."] } },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, password: hashed, name: name || null },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: { _: ["Registration failed. Please try again."] } },
      { status: 500 }
    );
  }
}
