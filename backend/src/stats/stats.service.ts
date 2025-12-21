import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Get counts in parallel for better performance
    const [
      totalBooks,
      availableBooks,
      totalAuthors,
      totalUsers,
      activeBorrows,
      recentBorrows,
      overdueBorrows,
    ] = await Promise.all([
      // Total books count
      this.prisma.book.count(),
      
      // Available books count
      this.prisma.book.count({
        where: { available: true },
      }),
      
      // Total authors count
      this.prisma.author.count(),
      
      // Total users count
      this.prisma.user.count(),
      
      // Active borrows count (not returned yet)
      this.prisma.borrowedBook.count({
        where: { returnedAt: null },
      }),
      
      // Recent borrowed books (last 10)
      this.prisma.borrowedBook.findMany({
        take: 10,
        orderBy: { borrowedAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
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
      }),
      
      // Overdue books (due date passed and not returned)
      this.prisma.borrowedBook.findMany({
        where: {
          returnedAt: null,
          dueDate: {
            lt: new Date(),
          },
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
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
      }),
    ]);

    // Calculate borrowed books count (books marked as unavailable)
    // This represents books currently checked out based on the 'available' flag
    const borrowedBooks = totalBooks - availableBooks;

    return {
      summary: {
        totalBooks,
        availableBooks,
        borrowedBooks, // Books currently marked as unavailable/checked out
        totalAuthors,
        totalUsers,
        activeBorrows, // Active borrow records (not yet returned)
        overdueCount: overdueBorrows.length,
      },
      recentActivity: recentBorrows,
      overdueBooks: overdueBorrows,
    };
  }
}
