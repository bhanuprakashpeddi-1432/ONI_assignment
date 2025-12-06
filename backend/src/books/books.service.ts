import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) { }

    async create(createBookDto: CreateBookDto) {
        const authorExists = await this.prisma.author.findUnique({
            where: { id: createBookDto.authorId },
        });

        if (!authorExists) {
            throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
        }

        const existingBook = await this.prisma.book.findUnique({
            where: { isbn: createBookDto.isbn },
        });

        if (existingBook) {
            throw new ConflictException('Book with this ISBN already exists');
        }

        return this.prisma.book.create({
            data: {
                title: createBookDto.title,
                isbn: createBookDto.isbn,
                publishedDate: createBookDto.publishedDate ? new Date(createBookDto.publishedDate) : null,
                authorId: createBookDto.authorId,
            },
            include: {
                author: true,
            },
        });
    }

    async findAll(authorId?: string, available?: string, search?: string) {
        const where: any = {};

        if (authorId) {
            where.authorId = authorId;
        }

        if (available !== undefined) {
            if (available === 'true') {
                where.available = true;
            } else if (available === 'false') {
                where.available = false;
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { isbn: { contains: search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.book.findMany({
            where,
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                author: true,
                borrowedBooks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    where: {
                        returnedAt: null,
                    },
                },
            },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return book;
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
        const book = await this.prisma.book.findUnique({
            where: { id },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        if (updateBookDto.authorId) {
            const authorExists = await this.prisma.author.findUnique({
                where: { id: updateBookDto.authorId },
            });

            if (!authorExists) {
                throw new NotFoundException(`Author with ID ${updateBookDto.authorId} not found`);
            }
        }

        if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
            const existingBook = await this.prisma.book.findUnique({
                where: { isbn: updateBookDto.isbn },
            });

            if (existingBook) {
                throw new ConflictException('Book with this ISBN already exists');
            }
        }

        return this.prisma.book.update({
            where: { id },
            data: {
                title: updateBookDto.title,
                isbn: updateBookDto.isbn,
                publishedDate: updateBookDto.publishedDate ? new Date(updateBookDto.publishedDate) : undefined,
                authorId: updateBookDto.authorId,
                available: updateBookDto.available,
            },
            include: {
                author: true,
            },
        });
    }

    async remove(id: string) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                borrowedBooks: {
                    where: {
                        returnedAt: null,
                    },
                },
            },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        if (book.borrowedBooks.length > 0) {
            throw new BadRequestException('Cannot delete a book that is currently borrowed');
        }

        await this.prisma.book.delete({
            where: { id },
        });

        return { message: 'Book deleted successfully' };
    }
}
