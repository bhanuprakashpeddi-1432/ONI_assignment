import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateBorrowedBookDto {
    @IsUUID()
    bookId: string;

    @IsUUID()
    userId: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;
}
