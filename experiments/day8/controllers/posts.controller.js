import * as postsService from '../services/posts.service.js';
import { sendSuccess } from '../lib/response.js';

export async function create(req, res, next) {
  try {
    const { title, content } = req.body;
    const post = await postsService.createPost({ title, content, authorId: req.user.id });
    sendSuccess(res, post, 201);
  } catch (error) {
    next(error);
  }
}

export async function findMany(req, res, next) {
  try {
    const posts = await postsService.findPosts(req.query);
    sendSuccess(res, posts);
  } catch (error) {
    next(error);
  }
}

export async function findById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const post = await postsService.findPostById(id);
    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const post = await postsService.updatePost(id, { title, content });
    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await postsService.deletePost(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default { create, findMany, findById, update, remove };
