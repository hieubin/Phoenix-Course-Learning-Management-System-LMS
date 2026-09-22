import prisma from '../lib/prisma.js';
import HttpError from '../errors/httpError.js';

export async function createPost(data) {
  return prisma.post.create({ data });
}

export async function findPosts(query = {}) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const pageSize = query.pageSize === undefined ? 10 : Number(query.pageSize);
  const authorId = query.authorId === undefined ? undefined : Number(query.authorId);
  const sortBy = query.sortBy === undefined ? 'createdAt' : query.sortBy;
  const order = query.order === undefined ? 'desc' : query.order;

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, 'page must be a positive integer');
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new HttpError(400, 'pageSize must be a positive integer');
  }
  if (pageSize > 50) {
    throw new HttpError(400, 'pageSize must not exceed 50');
  }
  if (authorId !== undefined && (!Number.isInteger(authorId) || authorId < 1)) {
    throw new HttpError(400, 'authorId must be a positive integer');
  }
  if (!['createdAt', 'title', 'id'].includes(sortBy)) {
    throw new HttpError(400, 'sortBy must be createdAt, title, or id');
  }
  if (!['asc', 'desc'].includes(order)) {
    throw new HttpError(400, 'order must be asc or desc');
  }

  const where = {
    ...(query.q ? { title: { contains: query.q, mode: 'insensitive' } } : {}),
    ...(authorId === undefined ? {} : { authorId }),
  };

  // Offset pagination must scan past skipped rows before returning results.
  // As the offset grows, that scan becomes slower and less efficient.
  const skip = (page - 1) * pageSize;
  const [items, totalItems] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { [sortBy]: order },
      include: { author: { select: { id: true, name: true, email: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
      pageSize,
    },
  };
}

export async function findPostById(id) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  if (!post) throw new HttpError(404, 'Post not found');
  return post;
}

export async function updatePost(id, data) {
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}

export default { createPost, findPosts, findPostById, updatePost, deletePost };
