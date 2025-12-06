import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Load environment variables
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {},
        create: {
            email: 'admin@library.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create regular users
    const user1Password = await bcrypt.hash('user123', 10);
    const user1 = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            password: user1Password,
            name: 'John Doe',
            role: 'USER',
        },
    });

    const user2Password = await bcrypt.hash('user123', 10);
    const user2 = await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {},
        create: {
            email: 'jane@example.com',
            password: user2Password,
            name: 'Jane Smith',
            role: 'USER',
        },
    });
    console.log('✅ Created regular users');

    // Create authors
    const author1 = await prisma.author.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            name: 'J.K. Rowling',
            bio: 'British author, best known for the Harry Potter series',
            birthDate: new Date('1965-07-31'),
        },
    });

    const author2 = await prisma.author.upsert({
        where: { id: '2' },
        update: {},
        create: {
            id: '2',
            name: 'George R.R. Martin',
            bio: 'American novelist and short story writer, known for A Song of Ice and Fire',
            birthDate: new Date('1948-09-20'),
        },
    });

    const author3 = await prisma.author.upsert({
        where: { id: '3' },
        update: {},
        create: {
            id: '3',
            name: 'J.R.R. Tolkien',
            bio: 'English writer and philologist, author of The Lord of the Rings',
            birthDate: new Date('1892-01-03'),
        },
    });
    console.log('✅ Created authors');

    // Create books
    await prisma.book.upsert({
        where: { isbn: '978-0439708180' },
        update: {},
        create: {
            title: "Harry Potter and the Sorcerer's Stone",
            isbn: '978-0439708180',
            publishedDate: new Date('1997-06-26'),
            authorId: author1.id,
            available: true,
        },
    });

    await prisma.book.upsert({
        where: { isbn: '978-0439064873' },
        update: {},
        create: {
            title: 'Harry Potter and the Chamber of Secrets',
            isbn: '978-0439064873',
            publishedDate: new Date('1998-07-02'),
            authorId: author1.id,
            available: true,
        },
    });

    await prisma.book.upsert({
        where: { isbn: '978-0553103540' },
        update: {},
        create: {
            title: 'A Game of Thrones',
            isbn: '978-0553103540',
            publishedDate: new Date('1996-08-01'),
            authorId: author2.id,
            available: false,
        },
    });

    await prisma.book.upsert({
        where: { isbn: '978-0547928210' },
        update: {},
        create: {
            title: 'The Hobbit',
            isbn: '978-0547928210',
            publishedDate: new Date('1937-09-21'),
            authorId: author3.id,
            available: true,
        },
    });

    await prisma.book.upsert({
        where: { isbn: '978-0544003415' },
        update: {},
        create: {
            title: 'The Lord of the Rings',
            isbn: '978-0544003415',
            publishedDate: new Date('1954-07-29'),
            authorId: author3.id,
            available: true,
        },
    });
    console.log('✅ Created books');

    // Create a borrowed book record
    const gameOfThrones = await prisma.book.findUnique({
        where: { isbn: '978-0553103540' },
    });

    if (gameOfThrones) {
        await prisma.borrowedBook.create({
            data: {
                bookId: gameOfThrones.id,
                userId: user1.id,
                borrowedAt: new Date(),
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            },
        });
        console.log('✅ Created borrowed book record');
    }

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
