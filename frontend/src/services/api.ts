import api from '../lib/axios';
import { Author, Book, User, BorrowedBook, RegisterData } from '../types';

export const authorsApi = {
    getAll: () => api.get<Author[]>('/authors'),
    getOne: (id: string) => api.get<Author>(`/authors/${id}`),
    create: (data: Partial<Author>) => api.post<Author>('/authors', data),
    update: (id: string, data: Partial<Author>) => api.patch<Author>(`/authors/${id}`, data),
    delete: (id: string) => api.delete(`/authors/${id}`),
};

export const booksApi = {
    getAll: (params?: { authorId?: string; available?: string; search?: string }) =>
        api.get<Book[]>('/books', { params }),
    getOne: (id: string) => api.get<Book>(`/books/${id}`),
    create: (data: Partial<Book>) => api.post<Book>('/books', data),
    update: (id: string, data: Partial<Book>) => api.patch<Book>(`/books/${id}`, data),
    delete: (id: string) => api.delete(`/books/${id}`),
};

export const usersApi = {
    getAll: () => api.get<User[]>('/users'),
    getOne: (id: string) => api.get<User>(`/users/${id}`),
    create: (data: RegisterData) => api.post<User>('/users', data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

export const borrowedBooksApi = {
    getAll: () => api.get<BorrowedBook[]>('/borrowed-books'),
    getByUser: (userId: string) => api.get<BorrowedBook[]>(`/borrowed-books/user/${userId}`),
    borrow: (data: { bookId: string; userId: string; dueDate?: string }) =>
        api.post<BorrowedBook>('/borrowed-books', data),
    return: (id: string) => api.patch<BorrowedBook>(`/borrowed-books/${id}/return`),
};
