import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('authors')
export class AuthorsController {
    constructor(private authorsService: AuthorsService) { }

    // ADMIN ONLY: Add new author (ensuring author data accuracy is management responsibility)
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorsService.create(createAuthorDto);
    }

    // PUBLIC: View all authors (users need to see who wrote the books)
    @Get()
    findAll() {
        return this.authorsService.findAll();
    }

    // PUBLIC: View author details (users need to see author information)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authorsService.findOne(id);
    }

    // ADMIN ONLY: Update author details (management responsibility)
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
        return this.authorsService.update(id, updateAuthorDto);
    }

    // ADMIN ONLY: Delete author (will cascade delete their books)
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.authorsService.remove(id);
    }
}
