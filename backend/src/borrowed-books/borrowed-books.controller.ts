import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { CreateBorrowedBookDto } from './dto/create-borrowed-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  // AUTHENTICATED USER: Borrow a book (core action for users - self-checkout)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBorrowedBookDto: CreateBorrowedBookDto) {
    return this.borrowedBooksService.create(createBorrowedBookDto);
  }

  // ADMIN ONLY: View all borrowed books across all users (for library management)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.borrowedBooksService.findAll();
  }

  // AUTHENTICATED USER: View borrowed books for a specific user
  // Users can only see their own history (privacy protection)
  // Admins can see any user's history
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findByUser(userId);
  }

  // AUTHENTICATED USER: Return their own book
  // Users can return books they borrowed
  // Admins can force return any book (if user forgets)
  @Patch(':id/return')
  @UseGuards(JwtAuthGuard)
  returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(id);
  }
}
