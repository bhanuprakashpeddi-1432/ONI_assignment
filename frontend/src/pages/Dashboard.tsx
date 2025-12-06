import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authorsApi, booksApi, usersApi, borrowedBooksApi } from '../services/api';
import { Author, Book, User, BorrowedBook } from '../types';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'books' | 'authors' | 'users' | 'borrowed'>('books');

    // Books state
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const [filterAvailable, setFilterAvailable] = useState('');

    // Modal states
    const [showBookModal, setShowBookModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    // Form states
    const [bookForm, setBookForm] = useState({ title: '', isbn: '', authorId: '', publishedDate: '' });
    const [authorForm, setAuthorForm] = useState({ name: '', bio: '', birthDate: '' });
    const [borrowForm, setBorrowForm] = useState({ bookId: '', userId: '', dueDate: '' });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'books') {
                const [booksRes, authorsRes] = await Promise.all([
                    booksApi.getAll({ search: searchTerm, authorId: filterAuthor, available: filterAvailable }),
                    authorsApi.getAll(),
                ]);
                setBooks(booksRes.data);
                setAuthors(authorsRes.data);
            } else if (activeTab === 'authors') {
                const res = await authorsApi.getAll();
                setAuthors(res.data);
            } else if (activeTab === 'users') {
                const res = await usersApi.getAll();
                setUsers(res.data);
            } else if (activeTab === 'borrowed') {
                const [borrowedRes, usersRes] = await Promise.all([
                    borrowedBooksApi.getAll(),
                    usersApi.getAll(),
                ]);
                setBorrowedBooks(borrowedRes.data);
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await booksApi.create(bookForm);
            setShowBookModal(false);
            setBookForm({ title: '', isbn: '', authorId: '', publishedDate: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error creating book');
        }
    };

    const handleUpdateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBook) return;
        try {
            await booksApi.update(selectedBook.id, bookForm);
            setShowBookModal(false);
            setSelectedBook(null);
            setBookForm({ title: '', isbn: '', authorId: '', publishedDate: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error updating book');
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            await booksApi.delete(id);
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error deleting book');
        }
    };

    const handleCreateAuthor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authorsApi.create(authorForm);
            setShowAuthorModal(false);
            setAuthorForm({ name: '', bio: '', birthDate: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error creating author');
        }
    };

    const handleUpdateAuthor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAuthor) return;
        try {
            await authorsApi.update(selectedAuthor.id, authorForm);
            setShowAuthorModal(false);
            setSelectedAuthor(null);
            setAuthorForm({ name: '', bio: '', birthDate: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error updating author');
        }
    };

    const handleDeleteAuthor = async (id: string) => {
        if (!confirm('Are you sure? This will also delete all books by this author.')) return;
        try {
            await authorsApi.delete(id);
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error deleting author');
        }
    };

    const handleBorrowBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await borrowedBooksApi.borrow(borrowForm);
            setShowBorrowModal(false);
            setBorrowForm({ bookId: '', userId: '', dueDate: '' });
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error borrowing book');
        }
    };

    const handleReturnBook = async (id: string) => {
        if (!confirm('Mark this book as returned?')) return;
        try {
            await borrowedBooksApi.return(id);
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error returning book');
        }
    };

    const openEditBook = (book: Book) => {
        setSelectedBook(book);
        setBookForm({
            title: book.title,
            isbn: book.isbn,
            authorId: book.authorId,
            publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
        });
        setShowBookModal(true);
    };

    const openEditAuthor = (author: Author) => {
        setSelectedAuthor(author);
        setAuthorForm({
            name: author.name,
            bio: author.bio || '',
            birthDate: author.birthDate ? author.birthDate.split('T')[0] : '',
        });
        setShowAuthorModal(true);
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ background: 'white', boxShadow: 'var(--shadow)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0 }}>📚 Library Management</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="text-muted text-sm">Welcome, {user?.name}</span>
                        <button onClick={logout} className="btn btn-secondary btn-sm">Logout</button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Tabs */}
                <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {(['books', 'authors', 'users', 'borrowed'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary-600)' : '2px solid transparent',
                                    color: activeTab === tab ? 'var(--primary-600)' : 'var(--gray-600)',
                                    fontWeight: activeTab === tab ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Books Tab */}
                {activeTab === 'books' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ maxWidth: '300px' }}
                                />
                                <select
                                    className="form-control"
                                    value={filterAuthor}
                                    onChange={(e) => setFilterAuthor(e.target.value)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">All Authors</option>
                                    {authors.map((author) => (
                                        <option key={author.id} value={author.id}>{author.name}</option>
                                    ))}
                                </select>
                                <select
                                    className="form-control"
                                    value={filterAvailable}
                                    onChange={(e) => setFilterAvailable(e.target.value)}
                                    style={{ maxWidth: '150px' }}
                                >
                                    <option value="">All Status</option>
                                    <option value="true">Available</option>
                                    <option value="false">Borrowed</option>
                                </select>
                                <button onClick={loadData} className="btn btn-secondary">Apply Filters</button>
                            </div>
                            <button onClick={() => { setSelectedBook(null); setBookForm({ title: '', isbn: '', authorId: '', publishedDate: '' }); setShowBookModal(true); }} className="btn btn-primary">
                                + Add Book
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>ISBN</th>
                                            <th>Author</th>
                                            <th>Published</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map((book) => (
                                            <tr key={book.id}>
                                                <td style={{ fontWeight: 500 }}>{book.title}</td>
                                                <td className="text-muted text-sm">{book.isbn}</td>
                                                <td>{book.author?.name}</td>
                                                <td className="text-sm">{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : '-'}</td>
                                                <td>
                                                    <span className={`badge ${book.available ? 'badge-success' : 'badge-danger'}`}>
                                                        {book.available ? 'Available' : 'Borrowed'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button onClick={() => openEditBook(book)} className="btn btn-secondary btn-sm">Edit</button>
                                                        <button onClick={() => handleDeleteBook(book.id)} className="btn btn-danger btn-sm">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Authors Tab */}
                {activeTab === 'authors' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Authors</h3>
                            <button onClick={() => { setSelectedAuthor(null); setAuthorForm({ name: '', bio: '', birthDate: '' }); setShowAuthorModal(true); }} className="btn btn-primary">
                                + Add Author
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {authors.map((author) => (
                                    <div key={author.id} className="card">
                                        <h4 style={{ marginBottom: '0.5rem' }}>{author.name}</h4>
                                        {author.bio && <p className="text-muted text-sm" style={{ marginBottom: '0.5rem' }}>{author.bio}</p>}
                                        {author.birthDate && <p className="text-xs text-muted">Born: {new Date(author.birthDate).toLocaleDateString()}</p>}
                                        <p className="text-sm" style={{ marginTop: '0.5rem' }}>
                                            <span className="badge badge-info">{author._count?.books || 0} books</span>
                                        </p>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditAuthor(author)} className="btn btn-secondary btn-sm">Edit</button>
                                            <button onClick={() => handleDeleteAuthor(author.id)} className="btn btn-danger btn-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <h3 style={{ marginBottom: '1.5rem' }}>Users</h3>
                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td style={{ fontWeight: 500 }}>{u.name}</td>
                                                <td className="text-muted">{u.email}</td>
                                                <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                                                <td className="text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Borrowed Books Tab */}
                {activeTab === 'borrowed' && (
                    <div>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Borrowed Books</h3>
                            <button onClick={() => { setBorrowForm({ bookId: '', userId: '', dueDate: '' }); setShowBorrowModal(true); }} className="btn btn-primary">
                                + Borrow Book
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Book</th>
                                            <th>Borrower</th>
                                            <th>Borrowed</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowedBooks.map((bb) => (
                                            <tr key={bb.id}>
                                                <td style={{ fontWeight: 500 }}>{bb.book?.title}</td>
                                                <td>{bb.user?.name}</td>
                                                <td className="text-sm">{new Date(bb.borrowedAt).toLocaleDateString()}</td>
                                                <td className="text-sm">{new Date(bb.dueDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${bb.returnedAt ? 'badge-success' : 'badge-warning'}`}>
                                                        {bb.returnedAt ? 'Returned' : 'Active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {!bb.returnedAt && (
                                                        <button onClick={() => handleReturnBook(bb.id)} className="btn btn-success btn-sm">
                                                            Return
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Book Modal */}
            {showBookModal && (
                <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedBook ? 'Edit Book' : 'Add Book'}</h3>
                            <button className="modal-close" onClick={() => setShowBookModal(false)}>×</button>
                        </div>
                        <form onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bookForm.title}
                                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ISBN</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bookForm.isbn}
                                        onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Author</label>
                                    <select
                                        className="form-control"
                                        value={bookForm.authorId}
                                        onChange={(e) => setBookForm({ ...bookForm, authorId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Author</option>
                                        {authors.map((author) => (
                                            <option key={author.id} value={author.id}>{author.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Published Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={bookForm.publishedDate}
                                        onChange={(e) => setBookForm({ ...bookForm, publishedDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowBookModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">{selectedBook ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Author Modal */}
            {showAuthorModal && (
                <div className="modal-overlay" onClick={() => setShowAuthorModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedAuthor ? 'Edit Author' : 'Add Author'}</h3>
                            <button className="modal-close" onClick={() => setShowAuthorModal(false)}>×</button>
                        </div>
                        <form onSubmit={selectedAuthor ? handleUpdateAuthor : handleCreateAuthor}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={authorForm.name}
                                        onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-control"
                                        value={authorForm.bio}
                                        onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={authorForm.birthDate}
                                        onChange={(e) => setAuthorForm({ ...authorForm, birthDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowAuthorModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">{selectedAuthor ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Borrow Modal */}
            {showBorrowModal && (
                <div className="modal-overlay" onClick={() => setShowBorrowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Borrow Book</h3>
                            <button className="modal-close" onClick={() => setShowBorrowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleBorrowBook}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Book</label>
                                    <select
                                        className="form-control"
                                        value={borrowForm.bookId}
                                        onChange={(e) => setBorrowForm({ ...borrowForm, bookId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Book</option>
                                        {books.filter(b => b.available).map((book) => (
                                            <option key={book.id} value={book.id}>{book.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">User</label>
                                    <select
                                        className="form-control"
                                        value={borrowForm.userId}
                                        onChange={(e) => setBorrowForm({ ...borrowForm, userId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Due Date (optional, defaults to 14 days)</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={borrowForm.dueDate}
                                        onChange={(e) => setBorrowForm({ ...borrowForm, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowBorrowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Borrow</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
