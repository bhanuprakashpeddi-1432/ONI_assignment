import { IsString, IsOptional, IsDateString, MinLength, IsUUID } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(10)
    isbn: string;

    @IsDateString()
    @IsOptional()
    publishedDate?: string;

    @IsUUID()
    authorId: string;
}
