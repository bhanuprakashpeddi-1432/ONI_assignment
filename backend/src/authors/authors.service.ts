import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
    constructor(private prisma: PrismaService) { }

    async create(createAuthorDto: CreateAuthorDto) {
        return this.prisma.author.create({
            data: {
                name: createAuthorDto.name,
                bio: createAuthorDto.bio,
                birthDate: createAuthorDto.birthDate ? new Date(createAuthorDto.birthDate) : null,
            },
        });
    }

    async findAll() {
        return this.prisma.author.findMany({
            include: {
                _count: {
                    select: { books: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findOne(id: string) {
        const author = await this.prisma.author.findUnique({
            where: { id },
            include: {
                books: {
                    orderBy: {
                        publishedDate: 'desc',
                    },
                },
            },
        });

        if (!author) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }

        return author;
    }

    async update(id: string, updateAuthorDto: UpdateAuthorDto) {
        try {
            return await this.prisma.author.update({
                where: { id },
                data: {
                    name: updateAuthorDto.name,
                    bio: updateAuthorDto.bio,
                    birthDate: updateAuthorDto.birthDate ? new Date(updateAuthorDto.birthDate) : undefined,
                },
            });
        } catch (error) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
    }

    async remove(id: string) {
        try {
            await this.prisma.author.delete({
                where: { id },
            });
            return { message: 'Author deleted successfully' };
        } catch (error) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
    }
}
