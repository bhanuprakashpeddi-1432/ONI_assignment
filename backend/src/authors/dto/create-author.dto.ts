import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateAuthorDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string;
}
