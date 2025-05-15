const { createServer } = require('http'); //Carlotta
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  const quizData = [
     {"emoji": "🦁👑", "movie": "König der Löwen"},
  {"emoji": "🚢🧊❤️","movie": "Titanic"},
  {"emoji": "🧙‍♂️💍🌋","movie": "Herr der Ringe" },
  {"emoji": "🦸‍♂️🛡️🇺🇸","movie": "Captain America"},
  {"emoji": "🚗💨","movie": "Fast & Furious"},
  {"emoji": "👻🔫🗽","movie": "Ghostbusters"},
  {"emoji": "🕷️🧑‍💻🏙️","movie": "Spider-Man"},
  {"emoji": "👩‍🍳🐀🍝","movie": "Ratatouille"},
  {"emoji": "🧊❄️⛄️","movie": "Die Eiskönigin"},
  {"emoji": "🐼🥋", "movie": "Kung Fu Panda"},
  {"emoji": "👨‍🚀🌌","movie": "Interstellar"},
  {"emoji": "🦖🦕","movie": "Jurassic Park"},
  {"emoji": "👩‍🎤🎤","movie": "A Star is Born"},
  {"emoji": "🧙‍♂️⚡️","movie": "Harry Potter"},
  {"emoji": "🐉🔥","movie": "Drachenzähmen leicht gemacht"},
  {"emoji": "👨‍🚀🌌","movie": "Gravity"},
  {"emoji": "🧛‍♂️🧛‍♀️","movie": "Twilight"},
  {"emoji": "👨‍⚕️❤️","movie": "The Fault in Our Stars"},
  {"emoji": "🐶👮‍♂️","movie": "Beverly Hills Chihuahua"},
  {"emoji": "👨‍🎤🎸","movie": "Bohemian Rhapsody"},
  {"emoji": "🧙‍♂️⚔️","movie": "Der Hobbit"},
  {"emoji": "👨‍🚀🌌","movie": "Gravity"}
  ];

  let current = quizData[Math.floor(Math.random() * quizData.length)];

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);
    socket.emit('emoji', current.emoji);

    socket.on('answer', (text) => {
      if (typeof text !== 'string' || !text.trim()) {
        return;
      }

      const guess = text.toLowerCase().trim();
      const correct = current.movie.toLowerCase().trim();
      const result = guess === correct ? '✅' : '❌';

      // Send als einfache Zeichenkette – damit's sicher im Client ankommt
      const message = `${socket.id.slice(0, 5)}: ${result} ${text}`;
      io.emit('answerBroadcast', message);

      if (guess === correct) {
        current = quizData[Math.floor(Math.random() * quizData.length)];
        io.emit('emoji', current.emoji);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
    });
  });

  server.listen(3000, () => {
    console.log('🚀 Server läuft auf http://localhost:3000');
  });
});
