export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    id: string;
    name: string;
    bio?: string;
    birthDate?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        books: number;
    };
    books?: Book[];
}

export interface Book {
    id: string;
    title: string;
    isbn: string;
    publishedDate?: string;
    authorId: string;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    author?: Author;
    borrowedBooks?: BorrowedBook[];
}

export interface BorrowedBook {
    id: string;
    bookId: string;
    userId: string;
    borrowedAt: string;
    returnedAt?: string;
    dueDate: string;
    book?: Book;
    user?: Partial<User>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    user: User;
    access_token: string;
}
