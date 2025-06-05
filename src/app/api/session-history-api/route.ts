import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const lastSession = await prisma.session.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  if (!lastSession) {
    return NextResponse.json({ error: 'Keine Session gefunden' }, { status: 404 });
  }

  const recentScores = await prisma.score.findMany({
    include: { user: true },
  });

  const players = recentScores.map((s) => ({
    id: String(s.userId),
    username: s.user.username,
    score: s.points,
  }));

  const allRounds = await prisma.round.findMany({
    where: { sessionId: lastSession.id },
    include: {
      guesses: {
        include: { user: true },
      },
    },
  });

  const rounds = allRounds.map((round, index) => ({
    roundNumber: index + 1,
    emoji: round.emoji,
    correctAnswer: round.correctAnswer,
    answers: round.guesses.map((guess) => ({
      playerId: String(guess.userId),
      guess: guess.guess,
      isCorrect: guess.isCorrect,
    })),
  }));

  return NextResponse.json({
    sessionId: String(lastSession.id),
    startedAt: lastSession.createdAt.toISOString(),
    endedAt: new Date().toISOString(),
    players,
    rounds,
  });
}
