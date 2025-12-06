import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get()
    findAll(
        @Query('authorId') authorId?: string,
        @Query('available') available?: string,
        @Query('search') search?: string,
    ) {
        return this.booksService.findAll(authorId, available, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.booksService.remove(id);
    }
}
