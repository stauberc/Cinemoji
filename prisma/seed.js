const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const movies = [
  { emoji: "🦁👑", title: "König der Löwen" },
  { emoji: "🚢🧊❤️", title: "Titanic" },
  { emoji: "🧙‍♂️💍🌋", title: "Herr der Ringe" },
  { emoji: "🦸‍♂️🛡️🇺🇸", title: "Captain America" },
  { emoji: "🚗💨", title: "Fast & Furious" },
  { emoji: "👻🔫🗽", title: "Ghostbusters" },
  { emoji: "🕷️🧑‍💻🏙️", title: "Spider-Man" },
  { emoji: "👩‍🍳🐀🍝", title: "Ratatouille" },
  { emoji: "🧊❄️⛄️", title: "Die Eiskönigin" },
  { emoji: "🐼🥋", title: "Kung Fu Panda" },
  { emoji: "👨‍🚀🌌", title: "Interstellar" },
  { emoji: "🦖🦕", title: "Jurassic Park" },
  { emoji: "👨‍🎤🎤", title: "A Star is Born" },
  { emoji: "🧙‍♂️⚡️", title: "Harry Potter" },
  { emoji: "🐉🔥", title: "Drachenzähmen leicht gemacht" },
  { emoji: "🧛‍♂️🧛‍♀️", title: "Twilight" },
  { emoji: "👨‍⚕️❤️", title: "The Fault in Our Stars" },
  { emoji: "🐶👮‍♂️", title: "Beverly Hills Chihuahua" },
  { emoji: "👨‍🎤🎸", title: "Bohemian Rhapsody" },
  { emoji: "🧙‍♂️⚔️", title: "Der Hobbit" },
];

async function main() {
  await prisma.movie.deleteMany();
  await prisma.movie.createMany({ data: movies });
  console.log('✅ Filme wurden gespeichert.');
}

main().finally(() => prisma.$disconnect());
