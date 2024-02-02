import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
const prisma = new PrismaClient()
async function main() {
    const password = await hash('{Test123}', 10)
    const user = await prisma.user.upsert({
        where: { email: "relaxiaadmin@gmail.com" },
        update: {},
        create: {
            email: 'relaxiaadmin@gmail.com',
            names: 'Relaxia Admin',
            password,
            role: 'ADMIN',

        },
    })
    console.log({ user })
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