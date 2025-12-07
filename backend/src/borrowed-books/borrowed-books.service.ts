import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowedBookDto } from './dto/create-borrowed-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBorrowedBookDto: CreateBorrowedBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: createBorrowedBookDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createBorrowedBookDto.bookId} not found`,
      );
    }

    if (!book.available) {
      throw new BadRequestException(
        'This book is currently not available for borrowing',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createBorrowedBookDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createBorrowedBookDto.userId} not found`,
      );
    }

    const dueDate = createBorrowedBookDto.dueDate
      ? new Date(createBorrowedBookDto.dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const borrowedBook = await this.prisma.borrowedBook.create({
      data: {
        bookId: createBorrowedBookDto.bookId,
        userId: createBorrowedBookDto.userId,
        dueDate,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.prisma.book.update({
      where: { id: createBorrowedBookDto.bookId },
      data: { available: false },
    });

    return borrowedBook;
  }

  async findAll() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.borrowedBook.findMany({
      where: {
        userId,
        returnedAt: null,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async returnBook(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
      include: {
        book: true,
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException(
        `Borrowed book record with ID ${id} not found`,
      );
    }

    if (borrowedBook.returnedAt) {
      throw new BadRequestException('This book has already been returned');
    }

    const updatedBorrowedBook = await this.prisma.borrowedBook.update({
      where: { id },
      data: {
        returnedAt: new Date(),
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.prisma.book.update({
      where: { id: borrowedBook.bookId },
      data: { available: true },
    });

    return updatedBorrowedBook;
  }
}
