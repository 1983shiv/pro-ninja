import { prisma } from "@/lib/prisma"

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "Demo User" },
  })

  await prisma.post.create({
    data: {
      title: "Hello Mongo + Prisma",
      content: "This is a seeded post.",
      authorId: user.id,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })