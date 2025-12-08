import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) { }

    // ADMIN ONLY: Add new book to inventory
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    // PUBLIC: View/Search Books with filters (available to all users including non-authenticated)
    @Get()
    findAll(
        @Query('authorId') authorId?: string,
        @Query('available') available?: string,
        @Query('search') search?: string,
    ) {
        return this.booksService.findAll(authorId, available, search);
    }

    // PUBLIC: View single book details
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    // ADMIN ONLY: Update book details in inventory
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    // ADMIN ONLY: Delete book from inventory (regular users cannot delete)
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.booksService.remove(id);
    }
}
