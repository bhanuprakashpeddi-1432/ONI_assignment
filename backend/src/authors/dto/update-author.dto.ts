import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class UpdateAuthorDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string;
}
