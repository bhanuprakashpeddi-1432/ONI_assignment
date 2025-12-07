import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { CreateBorrowedBookDto } from './dto/create-borrowed-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('borrowed-books')
export class BorrowedBooksController {
  constructor(private borrowedBooksService: BorrowedBooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBorrowedBookDto: CreateBorrowedBookDto) {
    return this.borrowedBooksService.create(createBorrowedBookDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.borrowedBooksService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findByUser(userId);
  }

  @Patch(':id/return')
  @UseGuards(JwtAuthGuard)
  returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(id);
  }
}
