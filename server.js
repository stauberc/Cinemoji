const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

//Carlotta

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const players = {};
let current = null;
let isGameRunning = false;
let currentSessionId = null;
let currentRoundId = null;
let gameRounds = []; // Speichert alle Runden für spätere Anzeige

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  async function startGame() {
    isGameRunning = true;
    const count = await prisma.movie.count();
    const randomIndex = Math.floor(Math.random() * count);
    current = await prisma.movie.findFirst({ skip: randomIndex });

    const round = await prisma.round.create({
      data: {
        sessionId: currentSessionId,
        emoji: current.emoji,
        correctAnswer: current.title,
      },
    });
    currentRoundId = round.id;

    gameRounds.push({
      roundId: currentRoundId,
      emoji: current.emoji,
      correctAnswer: current.title,
      answers: [],
    });

    io.emit('gameStarting');
    setTimeout(() => {
      if (current) {
        io.emit('emoji', current.emoji);
      }
    }, 3000);
  }

  function checkIfGameCanStart() {
    const playerCount = Object.keys(players).length;
    io.emit('playerListUpdate', playerCount);
    if (playerCount >= 2 && !isGameRunning) {
      startGame();
    } else if (playerCount < 2) {
      io.emit('waitingForPlayers');
      isGameRunning = false;
    }
  }

  io.on('connection', async (socket) => {
    const { username } = socket.handshake.query;
    if (!username || typeof username !== 'string') return socket.disconnect();

    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) user = await prisma.user.create({ data: { username } });

    if (!currentSessionId) {
      const session = await prisma.session.create({ data: { userId: user.id } });
      currentSessionId = session.id;
    }

    players[socket.id] = { score: 0, username, userId: user.id };
    console.log('✅ Neuer Spieler:', username);
    checkIfGameCanStart();

    socket.on('answer', async (text) => {
      if (!text || typeof text !== 'string') return;
      if (!current) return;

      const guess = text.toLowerCase().trim();
      const correct = current.title.toLowerCase().trim();
      const isCorrect = guess === correct;
      const player = players[socket.id];
      if (!player) return;

      const message = `${player.username}: ${isCorrect ? '✅' : '❌'} ${text}`;
      io.emit('answerBroadcast', message);

      await prisma.guess.create({
        data: {
          roundId: currentRoundId,
          userId: player.userId,
          guess: text,
          isCorrect,
        },
      });

      // Speichern der Antwort für History-Ausgabe
      const lastRound = gameRounds[gameRounds.length - 1];
      lastRound.answers.push({
        username: player.username,
        guess: text,
        isCorrect,
      });

      if (isCorrect) {
        player.score++;
        socket.emit('scoreUpdate', player.score);

        const count = await prisma.movie.count();
        const randomIndex = Math.floor(Math.random() * count);
        current = await prisma.movie.findFirst({ skip: randomIndex });

        const newRound = await prisma.round.create({
          data: {
            sessionId: currentSessionId,
            emoji: current.emoji,
            correctAnswer: current.title,
          },
        });
        currentRoundId = newRound.id;

        gameRounds.push({
          roundId: currentRoundId,
          emoji: current.emoji,
          correctAnswer: current.title,
          answers: [],
        });

        io.emit('emoji', current.emoji);
      }
    });

    socket.on('requestScores', async () => {
      const scores = Object.entries(players).map(([id, data]) => ({
        id,
        shortId: id.slice(0, 5),
        username: data.username,
        userId: data.userId,
        score: data.score,
      }));

      for (const s of scores) {
        await prisma.score.create({
          data: { userId: s.userId, points: s.score },
        });
      }

      io.emit('finalScores', scores);
      io.emit('gameSummary', {
        players: scores,
        rounds: gameRounds,
      });

      isGameRunning = false;
    });

    socket.on('disconnect', () => {
      delete players[socket.id];
      checkIfGameCanStart();
    });
  });

  server.listen(3000, () => {
    console.log('✅ Server läuft auf http://localhost:3000');
  });
});
