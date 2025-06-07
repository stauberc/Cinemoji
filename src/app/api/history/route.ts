// /app/api/history/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      rounds: {
        orderBy: { createdAt: 'asc' },
        include: {
          guesses: {
            include: { user: true },
          },
        },
      },
    },
  });

  return NextResponse.json(sessions);
}
