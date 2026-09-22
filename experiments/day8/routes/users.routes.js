import express from 'express';
import * as usersCtrl from '../controllers/users.controller.js';
import { validateIdParam } from '../middlewares/validators.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', usersCtrl.create);
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), usersCtrl.findMany);
router.get('/:id/posts', authMiddleware, validateIdParam, usersCtrl.findPosts);
router.get('/:id', authMiddleware, validateIdParam, usersCtrl.findById);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), validateIdParam, usersCtrl.update);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), validateIdParam, usersCtrl.remove);

export default router;
