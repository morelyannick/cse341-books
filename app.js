import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import { getDb } from './data/database.js';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Server is running'
  });
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document identifier
 *         id:
 *           type: string
 *           description: Book ID
 *         title:
 *           type: string
 *           description: Title of the book
 *         author:
 *           type: string
 *           description: Author of the book
 *         genre:
 *           type: string
 *           description: Genre of the book
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal Server Error
 * /books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books
 *     description: Retrieve a list of all books from the database.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a single book by ID
 *     description: Retrieve a single book by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/books/:id', async (req, res) => {
  try {
    const db = await getDb();

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