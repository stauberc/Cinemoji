const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const players = {};
let current = null;
let isGameRunning = false;

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

    io.emit('gameStarting');
    setTimeout(() => {
      if (current) {
        io.emit('emoji', current.emoji);
      }
    }, 3000);
  }

  function checkIfGameCanStart() {
    const playerCount = Object.keys(players).length;
    console.log('🔄 Spieler online:', playerCount);
    io.emit('playerListUpdate', playerCount); // ➕ für Clientanzeige

    if (playerCount >= 2 && !isGameRunning) {
      startGame();
    } else if (playerCount < 2) {
      io.emit('waitingForPlayers');
      isGameRunning = false;
    }
  }

  io.on('connection', async (socket) => {
    const username = socket.handshake.query.username;
    if (!username) return socket.disconnect();

    console.log('✅ Neuer Spieler:', username);

    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await prisma.user.create({ data: { username } });
    }

    players[socket.id] = { score: 0, username, userId: user.id };

    await prisma.session.create({ data: { userId: user.id } });

    checkIfGameCanStart();

    socket.on('answer', async (text) => {
      if (!text || typeof text !== 'string') return;
      if (!current) return;

      const guess = text.toLowerCase().trim();
      const correct = current.title.toLowerCase().trim();
      const result = guess === correct ? '✅' : '❌';

      const message = `${players[socket.id].username}: ${result} ${text}`;
      io.emit('answerBroadcast', message);

      if (guess === correct) {
        players[socket.id].score++;
        socket.emit('scoreUpdate', players[socket.id].score);

        const count = await prisma.movie.count();
        const randomIndex = Math.floor(Math.random() * count);
        current = await prisma.movie.findFirst({ skip: randomIndex });

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
      isGameRunning = false;
    });

    socket.on('disconnect', () => {
      delete players[socket.id];
      console.log('❌ Spieler getrennt:', username);
      checkIfGameCanStart();
    });
  });

  server.listen(3000, '0.0.0.0', () => {
    console.log('✅ Server läuft auf http://localhost:3000');
  });
});