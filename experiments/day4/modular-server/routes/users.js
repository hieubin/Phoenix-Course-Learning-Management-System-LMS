import express from "express";
import { users } from "../data/store.js";

const router = express.Router();

// GET /users
router.get("/", (req, res) => {
  res.status(200).json(users);
});

// POST /users
router.post("/", (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// GET /users/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
});

export default router;