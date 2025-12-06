import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                name: createUserDto.name,
                role: createUserDto.role || 'USER',
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return users;
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                borrowedBooks: {
                    include: {
                        book: {
                            include: {
                                author: true,
                            },
                        },
                    },
                    where: {
                        returnedAt: null,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }
}
