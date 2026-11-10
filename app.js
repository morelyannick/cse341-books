import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import router from './src/router.js';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(router);

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
 *         authorId:
 *           type: string
 *           description: ID of the book's author
 *         title:
 *           type: string
 *           description: Title of the book
 *         publicationDate:
 *           type: string
 *           format: date
 *           description: Book publication date
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal Server Error
 */

export default app;