import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// CREATE
// POST /authors
router.post("/", async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const author = await prisma.author.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

// FIND MANY
// GET /authors
router.get("/", async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany();

    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

// FIND UNIQUE + EAGER LOADING
// GET /authors/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const author = await prisma.author.findUnique({
      where: {
        id,
      },
      include: {
        books: true,
      },
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

// UPDATE
// PUT /authors/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const author = await prisma.author.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

// DELETE
// DELETE /authors/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await prisma.author.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;