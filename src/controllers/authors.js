import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Missing required author fields.' });
  }

  const { id, name, birthYear } = body;
  if (
    typeof id !== 'string' || !id.trim() ||
    typeof name !== 'string' || !name.trim() ||
    !Number.isInteger(birthYear)
  ) {
    return res.status(400).json({ message: 'Missing required author fields.' });
  }

  try {
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    const author = await createAuthorInDb({ id, name, birthYear });
    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Missing required author fields.' });
  }

  const { name, birthYear } = body;
  if (
    typeof name !== 'string' || !name.trim() ||
    !Number.isInteger(birthYear)
  ) {
    return res.status(400).json({ message: 'Missing required author fields.' });
  }

  try {
    const { id } = req.params;
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const author = await updateAuthorInDb(id, { name, birthYear });
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    if (await authorHasBooks(id)) {
      return res.status(409).json({
        message: 'Author cannot be deleted because they still have books.'
      });
    }

    const result = await deleteAuthorFromDb(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
