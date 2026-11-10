import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const books = await db.collection('books').find({}).toArray();
  return books;
};

const getBookById = async (id) => {
  const db = getDb();
  const book = await db.collection('books').findOne({ id });
  return book;
};

const createBook = async (book) => {
  const db = getDb();
  await db.collection('books').insertOne(book);
  return book;
};

const updateBook = async (id, book) => {
  const db = getDb();
  const result = await db.collection('books').updateOne({ id }, { $set: book });

  if (result.matchedCount === 0) {
    return null;
  }

  return { id, ...book };
};

const deleteBook = async (id) => {
  const db = getDb();
  const result = await db.collection('books').deleteOne({ id });
  return result;
};

const authorExists = async (id) => {
  const db = getDb();
  const author = await db.collection('authors').findOne({ id });
  return Boolean(author);
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists };
