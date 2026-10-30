import express from 'express';
import { getDb } from './data/database.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Server is running'
  });
});

// GET /books
app.get('/books', async (req, res) => {
  try {
    const db = await getDb();

    const books = await db
      .collection('books')
      .find()
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
});

// GET /books/:id
app.get('/books/:id', async (req, res) => {
  try {
    const db = getDb();

    const book = await db
      .collection('books')
      .findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
});

export default app;