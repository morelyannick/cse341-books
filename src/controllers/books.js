import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  createBook as createBookInDb,
  updateBook as updateBookInDb,
  deleteBook as deleteBookFromDb,
  authorExists
} from '../models/books.js';

const getAllBooks = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookByIdFromDb(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve book.' });
  }
};

const createBook = async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Missing required book fields.' });
  }

  const { id, authorId, title, publicationDate } = body;
  if (
    typeof id !== 'string' || !id.trim() ||
    typeof authorId !== 'string' || !authorId.trim() ||
    typeof title !== 'string' || !title.trim() ||
    typeof publicationDate !== 'string' || !publicationDate.trim()
  ) {
    return res.status(400).json({ message: 'Missing required book fields.' });
  }

  try {
    if (await getBookByIdFromDb(id)) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    if (!await authorExists(authorId)) {
      return res.status(400).json({ message: 'Author not found.' });
    }

    const book = await createBookInDb({ id, authorId, title, publicationDate });
    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Unable to create book.' });
  }
};

const updateBook = async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Missing required book fields.' });
  }

  const { authorId, title, publicationDate } = body;
  if (
    typeof authorId !== 'string' || !authorId.trim() ||
    typeof title !== 'string' || !title.trim() ||
    typeof publicationDate !== 'string' || !publicationDate.trim()
  ) {
    return res.status(400).json({ message: 'Missing required book fields.' });
  }

  try {
    const { id } = req.params;
    if (!await getBookByIdFromDb(id)) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (!await authorExists(authorId)) {
      return res.status(400).json({ message: 'Author not found.' });
    }

    const book = await updateBookInDb(id, { authorId, title, publicationDate });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBookFromDb(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete book.' });
  }
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
