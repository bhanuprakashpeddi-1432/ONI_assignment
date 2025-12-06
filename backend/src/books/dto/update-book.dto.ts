import { IsString, IsOptional, IsDateString, MinLength, IsUUID, IsBoolean } from 'class-validator';

export class UpdateBookDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    title?: string;

    @IsString()
    @MinLength(10)
    @IsOptional()
    isbn?: string;

    @IsDateString()
    @IsOptional()
    publishedDate?: string;

    @IsUUID()
    @IsOptional()
    authorId?: string;

    @IsBoolean()
    @IsOptional()
    available?: boolean;
}
